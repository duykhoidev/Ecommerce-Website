"use client";
import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CartModal from "./CartModal";

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // TEMPORARY
  // const isLoggedIn = false;

  // AUTH WITH WIX-MANAGED AUTH
  const wixClient = useWixClient();
  const isLoggedIn = wixClient.auth.loggedIn();

  const router = useRouter();

  /* const login = async () => {
    const loginRequestData = wixClient.auth.generateOAuthData(
      `${process.env.NEXT_PUBLIC_ALLOWED_REDIRECT_DOMAINS}`
    );

    console.log(loginRequestData);

    localStorage.setItem("oAuthRedirectData", JSON.stringify(loginRequestData));
    const { authUrl } = await wixClient.auth.getAuthUrl(loginRequestData);
    console.log(authUrl);
    window.location.href = authUrl;
  }; */

  const handleProfile = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      // Ensure that we can close & open the component
      setIsProfileOpen((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    Cookies.remove("refreshToken");
    const { logoutUrl } = await wixClient.auth.logout(window.location.href);
    window.location.href = logoutUrl;
    setIsLoading(false);
    setIsProfileOpen(false);
    router.push(logoutUrl);
  };

  const { cart, counter, getCart } = useCartStore();

  useEffect(() => {
    /* const getCart = async () => {
      const res = await wixClient.currentCart.getCurrentCart();
      console.log(res);
    };
    getCart(); */
    getCart(wixClient);
  }, [wixClient, getCart]);

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <Image
        src="/profile.svg"
        alt=""
        height={22}
        width={22}
        className="cursor-pointer"
        onClick={handleProfile}
        // onClick={login}
      />
      {isProfileOpen && (
        <div className="absolute p-4 rounded-md top-12 left-0 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
          <Link href="/">Profile</Link>
          <div className="mt-2 cursor-pointer" onClick={handleLogout}>
            {isLoading ? "Logging out" : "Logout"}
          </div>
        </div>
      )}

      <Image
        src="/notification.svg"
        alt=""
        height={22}
        width={22}
        className="cursor-pointer"
      />

      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image src="/cart.svg" alt="" height={22} width={22} />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-colorCart rounded-full text-white text-sm flex items-center justify-center">
          {counter}
        </div>
      </div>
      {isCartOpen && <CartModal />}
    </div>
  );
};

export default NavIcons;
