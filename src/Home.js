import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import { auth } from './firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore'; 
import { db } from './firebase'; 

const Home = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [hasSubscribed, setHasSubscribed] = useState(false); // Track subscription status

  useEffect(() => {
    // Function to fetch subscriber count from Firestore
    const fetchSubscriberCount = async () => {
      try {
        const subscribersCollection = collection(db, 'subscribers');
        const subscriberSnapshot = await getDocs(subscribersCollection);
        const count = subscriberSnapshot.size;
        setSubscriberCount(count);
      } catch (error) {
        console.error('Error fetching subscriber count:', error);
      }
    };

    // Check if the user has already subscribed
    const checkSubscription = async () => {
      if (user) {
        const subscribersCollection = collection(db, 'subscribers');
        const q = query(subscribersCollection, where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        setHasSubscribed(querySnapshot.size > 0);
      }
    };

    fetchSubscriberCount();
    checkSubscription();
  }, [user]);

  const handleSubscribe = async () => {
    if (user && !hasSubscribed) { // Check if user hasn't subscribed yet
      try {
        // Add the user's UID to the "subscribers" collection
        await addDoc(collection(db, 'subscribers'), {
          uid: user.uid,
        });

        console.log('Subscribed successfully!');
        setSubscriberCount(prevCount => prevCount + 1);
        setHasSubscribed(true); // Mark user as subscribed
      } catch (error) {
        console.error('Error subscribing:', error);
      }
    }
  };

  const handleUnsubscribe = async () => {
    if (user && hasSubscribed) { // Check if user has subscribed
      try {
        const subscribersCollection = collection(db, 'subscribers');
        const q = query(subscribersCollection, where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach(async doc => {
          await deleteDoc(doc.ref);
        });

        console.log('Unsubscribed successfully!');
        setSubscriberCount(prevCount => prevCount - 1);
        setHasSubscribed(false); // Mark user as unsubscribed
      } catch (error) {
        console.error('Error unsubscribing:', error);
      }
    }
  };

  return (
    <Card title="Home">
      <p>User UID: {user ? user.uid : 'N/A'}</p>
      <p>User Email: {user ? user.email.split('@')[0] : 'N/A'}</p>
      <p>Subscriber: {subscriberCount}</p>
      {hasSubscribed ? (
        <Button type="primary" onClick={handleUnsubscribe}>
          Unsubscribe
        </Button>
      ) : (
        <Button type="primary" onClick={handleSubscribe}>
          Subscribe
        </Button>
      )}
    </Card>
  );
};

export default Home;
