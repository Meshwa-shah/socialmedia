import { initializeApp } from "firebase/app";
import {
    getMessaging,
    getToken
} from "firebase/messaging";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_apiKey,
    authDomain: import.meta.env.VITE_authDomain,
    projectId: import.meta.env.VITE_projectId,
    storageBucket: import.meta.env.VITE_storageBucket,
    messagingSenderId: import.meta.env.VITE_messagingSenderId,
    appId: import.meta.env.VITE_appId,
    measurementId: import.meta.env.VITE_measurementId
};

const app =
    initializeApp(
        firebaseConfig
    );

export const messaging =
    getMessaging(app);

export const generateToken =
    async () => {

        const permission =
            await Notification.requestPermission();

        if (
            permission ===
            "granted"
        ) {

            const token =
                await getToken(
                    messaging,
                    {
                        vapidKey:import.meta.env.VITE_vapidKey
                           
                    }
                );

            return token;

        }

    };