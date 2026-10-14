/**
 * Script to securely create or register the initial Administrator for
 * Shri Mohan Singh Ji - Budivada Sarpanch Public Feedback Portal.
 *
 * Usage:
 *   node scripts/create-admin.js <email> <password>
 *
 * Example:
 *   node scripts/create-admin.js admin@budivada.in StrongPassword2026!
 */

const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require("fs");
const path = require("path");

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || "admin@budivada.in";
  const password = args[1] || "budivada2026";

  console.log(`\n--- Budivada Sarpanch Portal Admin Setup ---`);
  console.log(`Target Email: ${email}`);

  const serviceAccountPath = path.resolve(__dirname, "../serviceAccountKey.json");

  if (!fs.existsSync(serviceAccountPath)) {
    console.log(`\n[Notice] No serviceAccountKey.json found.`);
    console.log(`To create the administrator in production Firebase:`);
    console.log(`1. Go to Firebase Console -> Authentication -> Users -> Add user.`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`2. Go to Firestore Database -> 'admins' collection.`);
    console.log(`   Create document with ID = <User UID>`);
    console.log(`   Fields:`);
    console.log(`     - uid: <User UID>`);
    console.log(`     - email: "${email}"`);
    console.log(`     - role: "superadmin"`);
    console.log(`     - createdAt: "${new Date().toISOString()}"`);
    console.log(`\n[Local Demo Mode] In local development/demo mode, you can log in right away at:`);
    console.log(`   URL: http://localhost:3000/admin/login`);
    console.log(`   Email: admin@budivada.in`);
    console.log(`   Password: budivada2026\n`);
    return;
  }

  try {
    const serviceAccount = require(serviceAccountPath);
    initializeApp({
      credential: cert(serviceAccount),
    });

    const auth = getAuth();
    const db = getFirestore();

    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log(`User already exists in Firebase Auth with UID: ${userRecord.uid}`);
    } catch (e) {
      userRecord = await auth.createUser({
        email,
        password,
        displayName: "श्री मोहन सिंह जी प्रशासन टीम",
      });
      console.log(`Successfully created new Firebase Auth user with UID: ${userRecord.uid}`);
    }

    // Add to 'admins' collection in Firestore
    await db.collection("admins").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      role: "superadmin",
      createdAt: new Date().toISOString(),
    });

    console.log(`Successfully provisioned admin privileges in Firestore 'admins' collection!`);
  } catch (error) {
    console.error("Error setting up admin:", error);
  }
}

main();
