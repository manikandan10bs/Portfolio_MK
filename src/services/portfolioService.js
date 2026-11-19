import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { projects as defaultProjects } from "../data/projects";
import { certificates as defaultCertificates } from "../data/certificates";
import { personal as defaultProfile } from "../data/personal";

/* ─── HELPERS ────────────────────────────────────────────────────────────── */

/**
 * Removes any keys whose value is `undefined` so Firestore never throws
 * "Unsupported field value: undefined".
 */
export function stripUndefined(obj) {
  const cleaned = {};
  for (const [key, value] of Object.entries(obj || {})) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export function sortByOrder(items) {
  return [...items].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
}

/**
 * Fallback helper: converts & compresses an image file into a compact JPEG data URL
 * so certificate/project image uploads work reliably and instantly even if Firebase Storage isn't enabled yet.
 */
export function compressImageToDataUrl(file, maxWidth = 1000, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided."));
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        // Fill canvas with white background so transparent PNG badges don't render black
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        if (dataUrl.length > 400000) {
          dataUrl = canvas.toDataURL("image/jpeg", 0.65);
        }
        if (dataUrl.length > 400000) {
          const halfCanvas = document.createElement("canvas");
          halfCanvas.width = Math.round(width * 0.7);
          halfCanvas.height = Math.round(height * 0.7);
          const halfCtx = halfCanvas.getContext("2d");
          halfCtx.fillStyle = "#ffffff";
          halfCtx.fillRect(0, 0, halfCanvas.width, halfCanvas.height);
          halfCtx.drawImage(canvas, 0, 0, halfCanvas.width, halfCanvas.height);
          dataUrl = halfCanvas.toDataURL("image/jpeg", 0.6);
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Could not decode image file. Please provide a valid JPG/PNG/WEBP."));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error("Could not read file from disk."));
    reader.readAsDataURL(file);
  });
}

/* ─── REAL-TIME FIRESTORE SUBSCRIPTIONS (Live Database Sync) ─────────────── */

/**
 * Real-time listener for published projects in Firestore.
 * Automatically pushes updates to the UI whenever projects are added/edited in Firestore.
 */
export function subscribePublishedProjects(callback) {
  try {
    const colRef = collection(db, "projects");
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs
            .map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            }))
            .filter((p) => p.published !== false);
          callback(sortByOrder(items));
        } else {
          callback(defaultProjects.filter((p) => p.published !== false));
        }
      },
      (error) => {
        console.warn("Firestore projects listener notice:", error?.message);
        callback(defaultProjects.filter((p) => p.published !== false));
      }
    );
  } catch (err) {
    console.warn("Firestore projects subscription error:", err);
    callback(defaultProjects.filter((p) => p.published !== false));
    return () => {};
  }
}

/**
 * Real-time listener for published certificates in Firestore.
 * Automatically pushes updates to the UI whenever certificates are added/edited in Firestore.
 */
export function subscribePublishedCertificates(callback) {
  try {
    const colRef = collection(db, "certificates");
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs
            .map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            }))
            .filter((c) => c.published !== false);
          callback(sortByOrder(items));
        } else {
          callback(defaultCertificates.filter((c) => c.published !== false));
        }
      },
      (error) => {
        console.warn("Firestore certificates listener notice:", error?.message);
        callback(defaultCertificates.filter((c) => c.published !== false));
      }
    );
  } catch (err) {
    console.warn("Firestore certificates subscription error:", err);
    callback(defaultCertificates.filter((c) => c.published !== false));
    return () => {};
  }
}

/**
 * Real-time listener for public profile in Firestore.
 * Automatically pushes updates to the UI whenever profile settings are changed in Firestore.
 */
export function subscribePublicProfile(callback) {
  const baseProfile = {
    ...defaultProfile,
    title: defaultProfile.designation || "AI/ML & Generative AI Developer",
    headline: defaultProfile.name || "Manikandan N",
    shortIntro: defaultProfile.heroIntroduction || "",
  };

  try {
    const docRef = doc(db, "profile", "public");
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback({ ...baseProfile, ...snapshot.data() });
        } else {
          callback(baseProfile);
        }
      },
      (error) => {
        console.warn("Firestore profile listener notice:", error?.message);
        callback(baseProfile);
      }
    );
  } catch (err) {
    console.warn("Firestore profile subscription error:", err);
    callback(baseProfile);
    return () => {};
  }
}

/* ─── PUBLIC FETCHING (One-Shot with Fallback) ───────────────────────────── */

export async function getPublishedProjects() {
  try {
    const snapshot = await getDocs(collection(db, "projects"));
    if (!snapshot.empty) {
      const items = snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
        .filter((p) => p.published !== false);
      return sortByOrder(items);
    }
  } catch (error) {
    console.warn("Using local project defaults (Firestore notice):", error?.message || error);
  }
  return defaultProjects.filter((p) => p.published !== false);
}

export async function getPublishedCertificates() {
  try {
    const snapshot = await getDocs(collection(db, "certificates"));
    if (!snapshot.empty) {
      const items = snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
        .filter((c) => c.published !== false);
      return sortByOrder(items);
    }
  } catch (error) {
    console.warn("Using local certificate defaults (Firestore notice):", error?.message || error);
  }
  return defaultCertificates.filter((c) => c.published !== false);
}

export async function getPublicProfile() {
  const baseProfile = {
    ...defaultProfile,
    title: defaultProfile.designation || "AI/ML & Generative AI Developer",
    headline: defaultProfile.name || "Manikandan N",
    shortIntro: defaultProfile.heroIntroduction || "",
  };

  try {
    const docRef = doc(db, "profile", "public");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...baseProfile, ...snap.data() };
    }
  } catch (error) {
    console.warn("Using local profile defaults:", error?.message || error);
  }
  return baseProfile;
}

/* ─── CONTACT INQUIRIES (Firestore Messages Collection) ─────────────────── */

export async function saveInquiry(inquiry) {
  const data = stripUndefined({
    name: inquiry.name || "Anonymous",
    email: inquiry.email || "",
    message: inquiry.message || "",
    createdAt: serverTimestamp(),
  });
  const docRef = await addDoc(collection(db, "inquiries"), data);
  return { id: docRef.id, ...data };
}

export async function getAllInquiriesAdmin() {
  try {
    const snapshot = await getDocs(collection(db, "inquiries"));
    if (!snapshot.empty) {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      return items.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
    }
  } catch (error) {
    console.warn("Error fetching inquiries from Firestore:", error);
  }
  return [];
}

export async function deleteInquiryDoc(id) {
  const refDoc = doc(db, "inquiries", id);
  await deleteDoc(refDoc);
}

/* ─── ADMIN OPERATIONS (Protected by Security Rules) ─────────────────────── */

export async function getAllProjectsAdmin() {
  try {
    const snapshot = await getDocs(collection(db, "projects"));
    if (!snapshot.empty) {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      return sortByOrder(items);
    }
  } catch (error) {
    console.error("Error fetching admin projects:", error);
  }
  return defaultProjects;
}

export async function saveProject(project) {
  const data = stripUndefined({
    title: project.title || "",
    shortTitle: project.shortTitle || project.title || "",
    subtitle: project.subtitle || "",
    number: project.number || "01",
    category: project.category || "AI / Machine Learning",
    badge: project.badge || "AI Project",
    description: project.description || "",
    features: Array.isArray(project.features)
      ? project.features
      : Array.isArray(project.architecture)
      ? project.architecture
      : typeof project.architecture === "string"
      ? project.architecture.split("\n").map((s) => s.trim()).filter(Boolean)
      : typeof project.features === "string"
      ? project.features.split("\n").map((s) => s.trim()).filter(Boolean)
      : [],
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : Array.isArray(project.tech)
      ? project.tech
      : typeof project.tech === "string"
      ? project.tech.split(",").map((t) => t.trim()).filter(Boolean)
      : typeof project.technologies === "string"
      ? project.technologies.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    thumbnail: project.thumbnail || project.thumbnailUrl || null,
    video: project.video || null,
    github: project.github || "",
    demo: project.demo || null,
    demoNote: project.demoNote || "",
    order: Number(project.order) || 1,
    published: project.published !== false,
    updatedAt: serverTimestamp(),
  });

  if (project.thumbnailUrl) {
    data.thumbnailUrl = project.thumbnailUrl;
  }

  if (project.id && !project.isNew) {
    const refDoc = doc(db, "projects", project.id);
    await setDoc(refDoc, data, { merge: true });
    return { id: project.id, ...data };
  } else {
    data.createdAt = serverTimestamp();
    const docRef = await addDoc(collection(db, "projects"), data);
    return { id: docRef.id, ...data };
  }
}

export async function deleteProjectDoc(projectId) {
  const refDoc = doc(db, "projects", projectId);
  await deleteDoc(refDoc);
}

export async function getAllCertificatesAdmin() {
  try {
    const snapshot = await getDocs(collection(db, "certificates"));
    if (!snapshot.empty) {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      return sortByOrder(items);
    }
  } catch (error) {
    console.error("Error fetching admin certificates:", error);
  }
  return defaultCertificates;
}

export async function saveCertificate(cert) {
  const data = stripUndefined({
    title: cert.title || "",
    issuer: cert.issuer || "",
    issuerOrg: cert.issuerOrg || cert.issuer || "",
    date: cert.date || "Certified",
    status: cert.status || "Verified Credential",
    image: cert.image || "",
    verifyUrl: cert.verifyUrl || "",
    credlyUrl: cert.credlyUrl || null,
    credentialId: cert.credentialId || "",
    summary: cert.summary || "",
    skills: Array.isArray(cert.skills)
      ? cert.skills
      : typeof cert.skills === "string"
      ? cert.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    accentColor: cert.accentColor || "#B99378",
    badgeTag: cert.badgeTag || "Certified",
    order: Number(cert.order) || 1,
    published: cert.published !== false,
    updatedAt: serverTimestamp(),
  });

  if (cert.id && !cert.isNew) {
    const refDoc = doc(db, "certificates", cert.id);
    await setDoc(refDoc, data, { merge: true });
    return { id: cert.id, ...data };
  } else {
    data.createdAt = serverTimestamp();
    const docRef = await addDoc(collection(db, "certificates"), data);
    return { id: docRef.id, ...data };
  }
}

export async function deleteCertificateDoc(certId) {
  const refDoc = doc(db, "certificates", certId);
  await deleteDoc(refDoc);
}

export async function saveProfileSettings(profileData) {
  const refDoc = doc(db, "profile", "public");
  const safeData = stripUndefined({
    title: profileData.title || profileData.designation || "AI/ML & Generative AI Developer",
    designation: profileData.designation || profileData.title || "AI/ML & Generative AI Developer",
    headline: profileData.headline || profileData.name || "Manikandan N",
    shortIntro: profileData.shortIntro || profileData.heroIntroduction || "",
    heroIntroduction: profileData.heroIntroduction || profileData.shortIntro || "",
    github: profileData.github || "",
    linkedin: profileData.linkedin || "",
    instagram: profileData.instagram || defaultProfile.instagram || "",
    email: profileData.email || defaultProfile.email || "",
    phone: profileData.phone || defaultProfile.phone || "",
    location: profileData.location || defaultProfile.location || "India",
    resumePath: profileData.resumePath || defaultProfile.resumePath || "",
    cloudinaryCloudName: profileData.cloudinaryCloudName || "",
    cloudinaryPreset: profileData.cloudinaryPreset || "",
    updatedAt: serverTimestamp(),
  });
  await setDoc(refDoc, safeData, { merge: true });
}

/**
 * Free Media Upload to Cloudinary (Free Tier: 25GB Storage & Streaming CDN, 0 Cost)
 */
export async function uploadToCloudinary(file, cloudName, uploadPreset) {
  if (!file) throw new Error("No file selected.");
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary Cloud Name and Upload Preset are required.");
  }

  const isVideo = file.type?.startsWith("video/") || /\.(mp4|webm|mov|mkv)$/i.test(file.name || "");
  const resourceType = isVideo ? "video" : "image";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Cloudinary upload failed (HTTP ${res.status})`);
  }

  const data = await res.json();
  return data.secure_url;
}

/**
 * Universal Zero-Cost Media Upload Helper
 * - Images/Certificates: Automatically compressed client-side and saved into Firestore ($0 cost forever).
 * - Videos: Uploads to free Cloudinary if configured, or prompts using free YouTube / Google Drive hosting.
 */
export async function uploadFileToStorage(file, folder = "uploads", cloudinaryConfig = null) {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  const isImage =
    (file.type && file.type.startsWith("image/")) ||
    /\.(jpg|jpeg|png|webp|gif|svg|bmp|jfif|avif)$/i.test(file.name || "");

  const isVideo =
    (file.type && file.type.startsWith("video/")) ||
    /\.(mp4|webm|mov|mkv)$/i.test(file.name || "");

  // 1. If Cloudinary free tier credentials are provided, upload there (supports both video & image)
  if (cloudinaryConfig?.cloudName && cloudinaryConfig?.preset) {
    return await uploadToCloudinary(file, cloudinaryConfig.cloudName, cloudinaryConfig.preset);
  }

  // 2. For Images & Certificates: Use client-side compression directly into Firestore (100% Free Forever)
  if (isImage) {
    return await compressImageToDataUrl(file);
  }

  // 3. For Videos without Cloudinary configured:
  if (isVideo) {
    throw new Error(
      "Direct video uploads require free video hosting. You can host videos for 100% free by: 1) Pasting a free unlisted YouTube link, 2) Pasting a Google Drive share link, or 3) Entering your free Cloudinary account in Profile settings."
    );
  }

  // Fallback for document files (like resume PDF)
  return await compressImageToDataUrl(file);
}

/* ─── ONE-CLICK SEEDING HELPER ───────────────────────────────────────────── */

export async function seedDefaultDataToFirestore() {
  let seededProjects = 0;
  let seededCerts = 0;

  for (let i = 0; i < defaultProjects.length; i++) {
    const { id, ...rawData } = defaultProjects[i];
    const data = stripUndefined({
      ...rawData,
      order: Number(rawData.order) || i + 1,
      published: rawData.published !== false,
      updatedAt: serverTimestamp(),
    });
    const docRef = doc(db, "projects", id);
    await setDoc(docRef, data, { merge: true });
    seededProjects++;
  }

  for (let i = 0; i < defaultCertificates.length; i++) {
    const { id, ...rawData } = defaultCertificates[i];
    const data = stripUndefined({
      ...rawData,
      order: Number(rawData.order) || i + 1,
      published: rawData.published !== false,
      updatedAt: serverTimestamp(),
    });
    const docRef = doc(db, "certificates", id);
    await setDoc(docRef, data, { merge: true });
    seededCerts++;
  }

  const profileRef = doc(db, "profile", "public");
  const profilePayload = stripUndefined({
    brandName: defaultProfile.brandName || "Mr.MK",
    name: defaultProfile.name || "Manikandan N",
    title: defaultProfile.title || defaultProfile.designation || "AI/ML & Generative AI Developer",
    designation: defaultProfile.designation || "AI/ML & Generative AI Developer",
    headline: defaultProfile.headline || defaultProfile.name || "Manikandan N",
    shortIntro: defaultProfile.shortIntro || defaultProfile.heroIntroduction || "",
    heroIntroduction: defaultProfile.heroIntroduction || "",
    email: defaultProfile.email || "",
    phone: defaultProfile.phone || "",
    instagram: defaultProfile.instagram || "",
    location: defaultProfile.location || "India",
    github: defaultProfile.github || "",
    linkedin: defaultProfile.linkedin || "",
    resumePath: defaultProfile.resumePath || "",
    updatedAt: serverTimestamp(),
  });
  await setDoc(profileRef, profilePayload, { merge: true });

  return { seededProjects, seededCerts };
}
