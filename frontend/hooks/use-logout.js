import { useAppDispatch } from '@/redux/hooks';
import { useLogoutMutation } from "@/redux/features/authApiSlice";
import { logout as setLogout } from '@/redux/features/authSlice'; 
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";

const { push } = useRouter();

const dispatch = useAppDispatch();
const [logout] = useLogoutMutation();

const handleLogout = () => {
  logout()
    .unwrap()
    .then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      dispatch(setLogout())
      toast.success('Logged out successfully.');
      window.location.href = '/auth/login';
    })
    .catch(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      dispatch(setLogout())
      toast.success('Logged out successfully.');
      window.location.href = '/auth/login';
    })
}

export default handleLogout
