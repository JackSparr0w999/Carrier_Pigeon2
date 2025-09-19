import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from '../firebase/config';

// ----------------------------------------------------
// Funzione per caricare un file su Firebase Storage e registrare i metadati su Firestore
// ----------------------------------------------------
export const uploadFile = async (file, sessionId) => {
  if (!file) {
    throw new Error("Nessun file fornito per l'upload.");
  }
  
  // 1. Carica il file su Firebase Storage
  const fileRef = ref(storage, `transfers/${sessionId}/${file.name}`);
  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);
  
  // 2. Determina il tipo di file in base al MIME type
  let fileType = 'document';
  if (file.type.startsWith('image/')) {
    fileType = 'photo';
  } else if (file.type.startsWith('video/')) {
    fileType = 'video';
  }

  // 3. Salva i metadati del file nel database Firestore
  await addDoc(collection(db, 'transfers'), {
    sessionId,
    fileName: file.name,
    fileSize: file.size,
    fileUrl: downloadURL,
    deviceName: navigator.platform,
    createdAt: new Date(),
    fileType: fileType
  });
  
  return { downloadURL, sessionId };
};

// ----------------------------------------------------
// Funzione per salvare un messaggio di testo su Firestore
// ----------------------------------------------------
export const uploadText = async (text, sessionId) => {
  if (!text.trim()) {
    throw new Error("Il testo non può essere vuoto.");
  }
  
  // Salva i dati testuali direttamente nel database Firestore
  await addDoc(collection(db, 'transfers'), {
    sessionId,
    textContent: text,
    deviceName: navigator.platform,
    createdAt: new Date(),
    fileType: 'text'
  });
  
  return { sessionId };
};

// ----------------------------------------------------
// Funzione per recuperare tutti i trasferimenti di una sessione
// ----------------------------------------------------
export const getTransfers = async (sessionId) => {
  if (!sessionId) {
    throw new Error("ID di sessione non fornito.");
  }

  const q = query(
    collection(db, 'transfers'),
    where('sessionId', '==', sessionId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  
  // Mappa i documenti Firestore in un array di oggetti JavaScript
  const transfers = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Adatta l'output per i componenti front-end
  return transfers.map(transfer => {
    if (transfer.createdAt) {
      // Converte il timestamp di Firebase in un formato gestibile da JavaScript
      transfer.created_date = transfer.createdAt.toDate().toISOString();
    }
    return transfer;
  });
};