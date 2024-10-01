import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { setAuth } from '@/redux/features/authSlice';
import { toast } from 'react-toastify';

export default function useSocialAuth(authenticate, provider) {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const searchParams = useSearchParams();

	const effectRan = useRef(false);

	useEffect(() => {
		const state = searchParams.get('state');
		const code = searchParams.get('code');

		if (state && code && !effectRan.current) {
			authenticate({ provider, state, code })
				.unwrap()
				.then(() => {
					dispatch(setAuth());
					toast.success('Sesión iniciada');
					window.location.href = '/dashboard';
				})
				.catch(() => {
					toast.error('Error al iniciar sesión');
					window.location.href = '/auth/login';
				});
		}

		return () => {
			effectRan.current = true;
		};
	}, [authenticate, provider]);
}
