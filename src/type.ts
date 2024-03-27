
export type userProp = {
    token: string, 
    userId: string,
    userName: string
  }

export type authProps = {
    isAuth: boolean,
    setIsAuth: (isAuth: boolean) => void,
    setUser: (user: userProp) => void;
}

export type CredentialsProps = {
    name?: string, 
    email: string,
    password: string
}

export type HomeProps = {
    user: userProp | null,
    isAuth: boolean,
    setIsAuth: (isAuth: boolean) => void
}

export type ProfileProps = {
  user: userProp | null,
  isAuth: boolean,
  setIsAuth: (isAuth: boolean) => void
}

export type File = {
  filePath: string,
  modifiedToFilePath: string
  userId: string
}