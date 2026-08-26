import { Navigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const ProtectedRoute = ({ children }) => {
  const {
    user,
    authLoading
  } = useAuth()

  // Refresh-token request chal rahi hai
  // Abhi login page par redirect MAT karo
  if (authLoading) {
    return <p>Loading...</p>
  }

  // Refresh check complete ho gaya
  // Fir bhi user nahi mila
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute