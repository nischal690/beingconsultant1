// Script to add sample products to Firestore
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  serverTimestamp 
} = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzMPbS5GOLgIQCyU8fNEkrSpLl7JZwAYM",
  authDomain: "beingconsultant-e5c75.firebaseapp.com",
  projectId: "beingconsultant-e5c75",
  storageBucket: "beingconsultant-e5c75.appspot.com",
  messagingSenderId: "1031058737191",
  appId: "1:1031058737191:web:9e6be5e889a0e9e9a7c379",
  measurementId: "G-VDWJD5QF1E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample products data
const products = [
  {
    id: "personality-test",
    title: "Personality Test",
    description: "Take the world's first and only personality test tailored to consulting careers.",
    shortDescription: "Discover your consulting strengths",
    iconName: "brain",
    category: "resources",
    price: 99,
    popular: true,
    featured: true,
    rating: 4.9
  },
  {
    id: "cheatsheet",
    title: "Cheatsheet",
    description: "Our proprietary industry cheatsheet with 20+ industry frameworks.",
    shortDescription: "Master key consulting frameworks",
    iconName: "lightbulb",
    category: "resources",
    price: 79,
    rating: 4.7
  },
  {
    id: "case-bank",
    title: "Case Bank",
    description: "Access to case bank with 300+ practice cases.",
    shortDescription: "Ace your case interviews",
    iconName: "hexagon",
    category: "resources",
    price: 129,
    popular: true,
    featured: true,
    rating: 4.8
  },
  {
    id: "cv-superguide",
    title: "CV Superguide",
    description: "Consulting CV Superguide to craft the perfect CV.",
    shortDescription: "Stand out from the competition",
    iconName: "fileText",
    category: "resources",
    price: 49,
    rating: 4.6
  },
  {
    id: "business-essentials",
    title: "Business Essentials",
    description: "Essential business knowledge and frameworks for consulting interviews.",
    shortDescription: "Core business knowledge",
    iconName: "barChart",
    category: "resources",
    price: 89,
    rating: 4.5
  },
  {
    id: "jumpstart-100",
    title: "Jumpstart 100",
    description: "Guide to thriving in the first 100 days of your consulting career.",
    shortDescription: "Excel in your new role",
    iconName: "brain",
    category: "resources",
    price: 69,
    rating: 4.7
  }
];

// Function to add products to Firestore
async function addProducts() {
  try {
    console.log('Adding products to Firestore...');
    
    for (const product of products) {
      const { id, ...productData } = product;
      const productRef = doc(db, 'products', id);
      
      await setDoc(productRef, {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log(`Added product: ${product.title}`);
    }
    
    console.log('All products added successfully!');
  } catch (error) {
    console.error('Error adding products:', error);
  }
}

// Run the function
addProducts();
