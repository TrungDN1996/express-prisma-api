export interface TokenUserDto {
  id: number;
  email: string;
  username: string;
  bio: string | null;
  image: string | null;
  token: string;
}
