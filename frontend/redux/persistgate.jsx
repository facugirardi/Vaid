'use client';

import { PersistGate } from "redux-persist/integration/react";
import { persistor } from '@/redux/store';

export default function CustomPersist({ children }) {
	return <PersistGate loading={null} persistor={persistor}>{children}</PersistGate>

}
