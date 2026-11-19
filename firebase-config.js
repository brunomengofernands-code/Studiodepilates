// Configuração oficial do Firebase SDK v13.4.0 — Studio Pilates LOUISE KARLA
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-analytics.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  enableIndexedDbPersistence
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEPx5wwU4b1JneU5vHk5PUj-zSEfIOMPI",
  authDomain: "studioapilates-86b2f.firebaseapp.com",
  projectId: "studioapilates-86b2f",
  storageBucket: "studioapilates-86b2f.firebasestorage.app",
  messagingSenderId: "759690764481",
  appId: "1:759690764481:web:4b755d3af9f9f55203b440",
  measurementId: "G-3RP2JKJBZV"
};

export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const dbFirestore = getFirestore(app);

// Habilita cache offline nativo do Firestore
enableIndexedDbPersistence(dbFirestore).catch((err) => {
  console.warn("Persistência offline Firestore:", err.code);
});

const STUDIO_DOC_REF = doc(dbFirestore, "studios", "louise_karla_main");

/**
 * Sincroniza o estado local (localStorage) com o Cloud Firestore em tempo real
 */
export async function syncLoadFromCloud(localKey, onRemoteUpdate) {
  try {
    const snap = await getDoc(STUDIO_DOC_REF);
    if (snap.exists() && snap.data()?.payload) {
      const remoteData = snap.data().payload;
      localStorage.setItem(localKey, JSON.stringify(remoteData));
      if (typeof onRemoteUpdate === "function") onRemoteUpdate(remoteData);
    }
  } catch (e) {
    console.error("Erro ao carregar dados do Firebase:", e);
  }

  // Listener em tempo real entre dispositivos (tablet, celular, desktop)
  return onSnapshot(STUDIO_DOC_REF, (snap) => {
    if (!snap.metadata.hasPendingWrites && snap.exists() && snap.data()?.payload) {
      const remoteData = snap.data().payload;
      const currentRaw = localStorage.getItem(localKey);
      const nextRaw = JSON.stringify(remoteData);
      if (currentRaw !== nextRaw) {
        localStorage.setItem(localKey, nextRaw);
        if (typeof onRemoteUpdate === "function") onRemoteUpdate(remoteData);
      }
    }
  });
}

/**
 * Grava o banco completo no Firestore sempre que save() é chamado no sistema
 */
export async function syncSaveToCloud(dbObject) {
  try {
    await setDoc(
      STUDIO_DOC_REF,
      {
        payload: JSON.parse(JSON.stringify(dbObject)),
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    return true;
  } catch (e) {
    console.error("Erro ao salvar no Firebase:", e);
    return false;
  }
}
