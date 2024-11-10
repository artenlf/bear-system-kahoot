// src/server/firebaseAdmin.ts
import admin from "firebase-admin";

const serviceAccount = require("path/to/your/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "your-storage-bucket-url"
});

const bucket = admin.storage().bucket();

export { admin, bucket };
