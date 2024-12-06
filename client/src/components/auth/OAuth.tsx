import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { app } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../../redux/userSlice";
import { googleLogin } from "../../api/authentication";

type Props = {
  setError?: (error: string) => void; // Make optional with a default fallback
};

const Oauth: React.FC<Props> = ({ setError = console.error }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth(app);

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      if (
        resultsFromGoogle.user.displayName &&
        resultsFromGoogle.user.email &&
        resultsFromGoogle.user.photoURL
      ) {
        const name = resultsFromGoogle.user.displayName;
        const email = resultsFromGoogle.user.email;
        const image = resultsFromGoogle.user.photoURL;

        const response = await googleLogin(name, email, image);

        if (response?.data.success) {
          const userDetails = response.data.student;

          dispatch(userActions.saveUser(userDetails));
          localStorage.setItem("user", JSON.stringify(userDetails));
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("refreshToken", response.data.refreshToken);

          navigate("/");
        } else {
          setError(response?.data.message || "Authentication failed");
        }
      }
    } catch (error) {
      setError("An error occurred during Google sign-in. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleGoogleClick}
        className="rounded text-black-500 px-6 ml-24 pb-2 pt-2 text-sm font-medium border border-gray-500 flex mt-2 items-center justify-center hover:bg-blue-500"
      >
        <FcGoogle size={30} className="mr-2" />
        <span className="text-base text-charcoal">Google</span>
      </button>
    </div>
  );
};

export default Oauth;
