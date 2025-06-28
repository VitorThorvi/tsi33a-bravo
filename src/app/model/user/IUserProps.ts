export interface IUserProps {
  name: string;
  email: string;
  password?: string;
  userType: 'owner' | 'admin' | 'user';
}
