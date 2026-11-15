import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { projects as defaultProjects } from "../data/projects";
import { certificates as defaultCertificates } from "../data/certificates";
import { personal as defaultProfile } from "../data/personal";

/* ─── PUBLIC FETCHING (With Instant Fallback) ────────────────────────────── */

export async function getPublishedProjects() {
  try {
    const q = query(
      collection(db, "projects"),
      where("published", "==", true),
      orderBy("order", "asc")
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    }
  } catch (error) {
    console.warn("Using local project defaults (Firestore notice):", error?.message || error);
  }
  return defaultProjects.filter((p) => p.published !== false);
}

export async function getPublishedCertificates() {
  try {
    const q = query(
      collection(db, "certificates"),
      where("published", "==", true),
      orderBy("order", "asc")
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    }
  } catch (error) {
    console.warn("Using local certificate defaults (Firestore notice):", error?.message || error);
  }
  return defaultCertificates.filter((c) => c.published !== false);
}

export async function getPublicProfile() {
  try {
    const docRef = doc(db, "profile", "public");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...defaultProfile, ...snap.data() };
    }
  } catch (error) {
    console.warn("Using local profile defaults:", error?.message || error);
  }
  return defaultProfile;
}

/* ─── ADMIN OPERATIONS (Protected by Security Rules) ─────────────────────── */

export async function getAllProjectsAdmin() {
  try {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    }
  } catch (error) {
    console.error("Error fetching admin projects:", error);
  }
  return defaultProjects;
}

export async function saveProject(project) {
  const data = {
    title: project.title || "",
    subtitle: project.subtitle || "",
    number: project.number || "01",
    category: project.category || "AI / Machine Learning",
    badge: project.badge || "AI Project",
    description: project.description || "",
    features: Array.isArray(project.features)
      ? project.features
      : Array.isArray(project.architecture)
      ? project.architecture
      : typeof project.features === "string"
      ? project.features.split("\n").filter(Boolean)
      : [],
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : Array.isArray(project.tech)
      ? project.tech
      : typeof project.technologies === "string"
      ? project.technologies.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    thumbnail: project.thumbnail || project.thumbnailUrl || null,
    video: project.video || null,
    github: project.github || "",
    demo: project.demo || "",
    demoNote: project.demoNote || "",
    order: Number(project.order) || 1,
    published: project.published !== false,
    updatedAt: serverTimestamp(),
  };

  if (project.thumbnailUrl) {
    data.thumbnailUrl = project.thumbnailUrl;
  }

  if (project.id && !project.isNew) {
    const refDoc = doc(db, "projects", project.id);
    await updateDoc(refDoc, data);
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
    const q = query(collection(db, "certificates"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    }
  } catch (error) {
    console.error("Error fetching admin certificates:", error);
  }
  return defaultCertificates;
}

export async function saveCertificate(cert) {
  const data = {
    title: cert.title || "",
    issuer: cert.issuer || "",
    issuerOrg: cert.issuerOrg || "",
    date: cert.date || "Certified",
    status: cert.status || "Verified Credential",
    image: cert.image || "",
    verifyUrl: cert.verifyUrl || "",
    credlyUrl: cert.credlyUrl || "",
    credentialId: cert.credentialId || "",
    summary: cert.summary || "",
    skills: Array.isArray(cert.skills)
      ? cert.skills
      : typeof cert.skills === "string"
      ? cert.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    accentColor: cert.accentColor || "#0062FF",
    badgeTag: cert.badgeTag || "Certified",
    order: Number(cert.order) || 1,
    published: cert.published !== false,
    updatedAt: serverTimestamp(),
  };

  if (cert.id && !cert.isNew) {
    const refDoc = doc(db, "certificates", cert.id);
    await updateDoc(refDoc, data);
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
  await setDoc(refDoc, { ...profileData, updatedAt: serverTimestamp() }, { merge: true });
}

export async function uploadFileToStorage(file, folder = "uploads") {
  const timestamp = Date.now();
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storageRef = ref(storage, `${folder}/${timestamp}_${cleanName}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}

/* ─── ONE-CLICK SEEDING HELPER ───────────────────────────────────────────── */

export async function seedDefaultDataToFirestore() {
  let seededProjects = 0;
  let seededCerts = 0;

  for (const p of defaultProjects) {
    const { id, ...data } = p;
    const docRef = doc(db, "projects", id);
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    seededProjects++;
  }

  for (const c of defaultCertificates) {
    const { id, ...data } = c;
    const docRef = doc(db, "certificates", id);
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    seededCerts++;
  }

  const profileRef = doc(db, "profile", "public");
  await setDoc(profileRef, {
    title: defaultProfile.title,
    headline: defaultProfile.headline,
    shortIntro: defaultProfile.shortIntro,
    github: defaultProfile.github,
    linkedin: defaultProfile.linkedin,
    resumePath: defaultProfile.resumePath,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  return { seededProjects, seededCerts };
}
