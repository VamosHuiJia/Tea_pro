// src/pages/Auth/AuthLayout.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface AuthModalWrapperProps {
  children: React.ReactNode;
  sideContent: React.ReactNode;        
  formSide: "left" | "right";          
}

export const AuthModalWrapper: React.FC<AuthModalWrapperProps> = ({
  children,
  sideContent,
  formSide = "right",
}) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-n-900/30 via-p-950/20 to-n-900/30" />

      {/* Card chính */}
      <div
        className={`
          relative w-full max-w-[1000px] lg:max-w-[1150px] mx-4 sm:mx-6 lg:mx-8 
          grid lg:grid-cols-2 overflow-hidden rounded-2xl lg:rounded-3xl 
          shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10 
          min-h-[580px] lg:min-h-[740px]
        `}
      >
        {/* Hình nền bên trái hoặc phải tùy formSide */}
        <div
          className={`
            relative hidden overflow-hidden lg:block lg:order-${formSide === "left" ? "2" : "1"}
          `}
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/65 via-black/30 to-transparent" />
          <img
            src="../../../public/images/tea-bg.jpg"   
            alt="Tea aesthetic background"
            className="absolute inset-0 object-cover w-full h-full transition-transform duration-1000 scale-105 hover:scale-110"
          />
          {sideContent}
        </div>

        {/* Form side - nền xanh đậm */}
        <div
          className={`
            relative flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16 
            bg-p-900/90 backdrop-blur-md 
            ${formSide === "left" ? "lg:border-r border-white/5 lg:border-r-0" : "lg:border-l border-white/5 lg:border-l-0"}
            lg:order-${formSide === "left" ? "1" : "2"}
          `}
        >
          {/* Nút đóng */}
          <button
            onClick={() => navigate(-1)}
            className="absolute z-20 transition-all top-5 right-5 sm:top-6 sm:right-6 hover:scale-110 active:scale-95"
            aria-label="Đóng"
          >
            <img
              src="/images/close.png"
              alt="Close"
              className="pointer-events-none w-7 h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100"
            />
          </button>

          {children}
        </div>
      </div>
    </div>
  );
};