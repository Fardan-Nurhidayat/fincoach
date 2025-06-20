"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { Button } from "@/view/components/ui/button";
import { Component } from "./Chart";
// Icons
import { FcBarChart } from "react-icons/fc";
import { FcConferenceCall } from "react-icons/fc";
import { FcBullish } from "react-icons/fc";
import { FcGraduationCap } from "react-icons/fc";

import { Link } from "react-router";

export default function Hero() {
  return (
    <div className='relative mx-auto my-5 flex max-w-7xl flex-col items-center justify-center'>
      <Navbar />
      <div className='px-4 pt-20 pb-10 md:py-20'>
        <h1 className='relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-purple-950 md:text-4xl lg:text-6xl '>
          {"Atur Keuanganmu Dengan Cerdas Bersama AI"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className='mr-2 inline-block'>
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className='relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-purple-950'>
          Dapatkan rekomendasi alokasi keuangan otomatis setiap bulan. FinCoach
          bantu kamu mengelola pengeluaran, tabungan, dan investasi dengan mudah
          dan cerdas.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className='relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4'>
          <a
            href='#simulasi'
            className='w-60 text-center cursor-pointer transform rounded-lg bg-purple-600 px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-700'>
            Coba Sekarang
          </a>
          <a
            href='#kontak'
            className='w-60 text-center cursor-pointer transform rounded-lg border border-purple-600 bg-white px-6 py-2 font-medium text-purple-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-600 hover:text-white'>
            Hubungi Kami
          </a>
        </motion.div>
      </div>
      <Stats />
      {/* <Component /> */}
    </div>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on navigation (for mobile UX)
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className='relative w-full flex items-center justify-between py-2 px-2 md:px-0'>
      <div className='flex items-center gap-2'>
        <div className='size-7 rounded-full bg-gradient-to-br from-purple-600 to-purple-200' />
        <h1 className='text-purple-950 font-bold md:text-2xl'>FinCoach</h1>
      </div>

      {/* Hamburger menu for mobile */}
      <div className='flex lg:hidden'>
        <button
          className='inline-flex items-center justify-center p-2 rounded-md text-purple-700 hover:text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600'
          aria-controls='mobile-menu'
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}>
          <svg
            className={`h-6 w-6 transition-transform ${
              isOpen ? "rotate-90" : ""
            }`}
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            {isOpen ? (
              // X icon
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            ) : (
              // Hamburger icon
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            )}
          </svg>
        </button>
      </div>

      {/* NavbarMenu for desktop */}
      <div className='hidden lg:flex'>
        <NavbarMenu />
      </div>

      {/* Auth buttons for desktop */}
      <div className='hidden lg:flex gap-5'>
        <Link
          to='/login'
          className='w-12 lg:w-32 text-center cursor-pointer transform rounded-lg bg-purple-600 px-2 py-1 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-700'>
          Masuk
        </Link>
        <Link
          to='/register'
          className='w-12 lg:w-32 text-center cursor-pointer transform rounded-lg border border-purple-600 bg-white px-2 py-1 font-medium text-purple-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-600 hover:text-white'>
          Daftar
        </Link>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className='absolute top-full left-0 w-full bg-white shadow-md z-50 lg:hidden animate-fade-in'>
          <ul className='flex flex-col px-4 py-3 gap-4'>
            <li>
              <a
                href='#'
                aria-label='Beranda'
                className='block py-2 px-2 text-[18px] rounded-lg focus:border focus:ring-purple-400 text-purple-900 hover:bg-purple-100'
                onClick={closeMenu}>
                Beranda
              </a>
            </li>
            <li>
              <a
                href='#fitur'
                aria-label='Fitur'
                className='block py-2 px-2 text-[18px] rounded-lg focus:border focus:ring-purple-400 text-purple-900 hover:bg-purple-100'
                onClick={closeMenu}>
                Fitur
              </a>
            </li>
            <li>
              <a
                href='#simulasi'
                aria-label='Simulasi'
                className='block py-2 px-2 text-[18px] rounded-lg focus:border focus:ring-purple-400 text-purple-900 hover:bg-purple-100'
                onClick={closeMenu}>
                Simulasi
              </a>
            </li>
            <li>
              <a
                href='#kontak'
                aria-label='Kontak'
                className='block py-2 px-2 text-[18px] rounded-lg focus:border focus:ring-purple-400 text-purple-900 hover:bg-purple-100'
                onClick={closeMenu}>
                Kontak
              </a>
            </li>
            <li>
              <Link
                to='/login'
                className='block w-full text-center cursor-pointer rounded-lg bg-purple-600 px-2 py-2 font-medium text-white mt-2 transition-all duration-300 hover:bg-purple-700'
                onClick={closeMenu}>
                Masuk
              </Link>
            </li>
            <li>
              <Link
                to='/register'
                className='block w-full text-center cursor-pointer rounded-lg border border-purple-600 bg-white px-2 py-2 font-medium text-purple-600 mt-1 transition-all duration-300 hover:bg-purple-600 hover:text-white'
                onClick={closeMenu}>
                Daftar
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

const NavbarMenu = () => {
  return (
    <ul className='flex items-center gap-7'>
      <li>
        <a
          aria-label='Beranda'
          className='text-[18px] focus:p-1 rounded-lg focus:border focus:ring-purple-400'
          href='#'>
          Beranda
        </a>
      </li>
      <li>
        <a
          aria-label='Fitur'
          className='text-[18px] focus:p-1 rounded-lg focus:border focus:ring-purple-400'
          href='#fitur'>
          Fitur
        </a>
      </li>

      <li>
        <a
          aria-label='Simulasi'
          className='text-[18px] focus:p-1 rounded-lg focus:border focus:ring-purple-400'
          href='#simulasi'>
          Simulasi
        </a>
      </li>
      <li>
        <a
          aria-label='Kontak'
          className='text-[18px] focus:p-1 rounded-lg focus:border focus:ring-purple-400'
          href='#kontak'>
          Kontak
        </a>
      </li>
    </ul>
  );
};
const Stats = () => {
  const stats = [
    { label: "Rekomendasi Bulanan", value: "4,500+", icon: <FcBarChart /> },
    {
      label: "Pengguna Terdaftar",
      value: "1,200+",
      icon: <FcConferenceCall />,
    },
    { label: "Akurasi Rekomendasi", value: "92%", icon: <FcBullish /> },
    { label: "Tim Profesional", value: "15+", icon: <FcGraduationCap /> },
  ];

  return (
    <section className='bg-white py-5'>
      <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='text-center'>
          <motion.h4
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className='text-xl font-medium text-purple-950'>
            Sejauh ini kami berhasil mencapai berbagai keberhasilan
          </motion.h4>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className='grid grid-cols-1 gap-6 px-6 mt-8  sm:px-0 lg:mt-16 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-12'>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.5,
                delay: 1.2 + index * 0.3, // starts after parent grid
                ease: "easeInOut",
              }}
              className='overflow-hidden bg-white border border-gray-200 rounded-lg cursor-pointer hover:-translate-y-2.5 duration-300 '>
              <div className='px-4 py-6'>
                <div className='flex items-center'>
                  <div className='text-3xl mr-4'>{stat.icon}</div>
                  <div>
                    <h4 className='text-heading1 font-bold text-purple-950'>
                      {stat.value}
                    </h4>
                    <p className='mt-1.5 text-lg font-medium leading-tight text-purple-900'>
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
