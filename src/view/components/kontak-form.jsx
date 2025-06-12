import React, { useRef } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function KontakForm() {
  const validateForm = ({ name, email, message }) => {
    if (!name || !email || !message) {
      return false;
    } else {
      return true;
    }
  };
  const formRef = useRef();

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const name = formData.get("name");
      const email = formData.get("email");
      const message = formData.get("message");
      if (!validateForm({ name, email, message })) {
        Swal.fire({
          title: "Lengkapi",
          text: "Mohon Lengkapi Form",
          icon: "error",
        });
        return;
      }
      Swal.fire({
        title: "Terkirim",
        text: "Berhasil mengirim pesan",
        icon: "success",
      });
      formRef.current.reset();
    } catch (error) {}
  };

  return (
    <section
      id='kontak'
      className='text-gray-700 body-font bg-white py-24'>
      <div className='container px-5 mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='flex flex-col text-center w-full mb-12'>
          <h1 className='sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-4'>
            Hubungi Kami
          </h1>
          <p className='lg:w-2/3 mx-auto leading-relaxed text-gray-500'>
            Punya pertanyaan, kritik, atau saran? Kirim pesan melalui form di
            bawah ini!
          </p>
        </motion.div>

        <div className='flex flex-wrap -mx-4 -mb-10 space-y-6 md:space-y-0'>
          {/*Lokasi & Informasi */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='lg:w-2/3 w-full px-4'>
            <div className='bg-gray-100 rounded-lg overflow-hidden h-[400px] relative'>
              <iframe
                width='100%'
                height='100%'
                title='map'
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.679050298206!2d109.01747617500426!3d-7.71754409230041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e651293a2007061%3A0xf2805342d2da3715!2sPoliteknik%20Negeri%20Cilacap!5e0!3m2!1sid!2sid!4v1747622587919!5m2!1sid!2sid'
                style={{ filter: "grayscale(0.5) contrast(1.2) opacity(0.6)" }}
                className='absolute inset-0 z-0'></iframe>

              {/* Overlay Info */}
              <div className='relative z-10 bg-white bg-opacity-90 p-6 shadow-md max-w-xs mx-auto md:mx-0'>
                <h3 className='title-font font-semibold text-gray-900 tracking-widest text-xs'>
                  ALAMAT
                </h3>
                <p className='leading-relaxed'>
                  Jl. Dr. Soetomo No. 1, Cilacap, Jawa Tengah
                </p>
                <h3 className='title-font font-semibold text-gray-900 tracking-widest text-xs mt-4'>
                  EMAIL
                </h3>
                <p className='leading-relaxed'>fardannurhidayat12@gmail.com</p>
                <h3 className='title-font font-semibold text-gray-900 tracking-widest text-xs mt-4'>
                  TELEPON
                </h3>
                <p className='leading-relaxed'>+62-859-370-953-88</p>
              </div>
            </div>
          </motion.div>

          {/*Form Kontak */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='lg:w-1/3 w-full px-4'>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className='bg-white shadow-md rounded-lg p-8'>
              <h2 className='text-gray-900 text-lg mb-1 font-medium title-font'>
                Kirim Pesan
              </h2>
              <p className='leading-relaxed mb-5 text-gray-600'>
                Isi form di bawah untuk menghubungi kami.
              </p>
              <div className='relative mb-4'>
                <label
                  htmlFor='name'
                  className='leading-7 text-sm text-gray-600'>
                  Nama
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  required
                  className='w-full bg-white rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-base outline-none text-gray-700 py-2 px-3 transition-colors duration-200 ease-in-out'
                />
              </div>
              <div className='relative mb-4'>
                <label
                  htmlFor='email'
                  className='leading-7 text-sm text-gray-600'>
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  required
                  className='w-full bg-white rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-base outline-none text-gray-700 py-2 px-3 transition-colors duration-200 ease-in-out'
                />
              </div>
              <div className='relative mb-4'>
                <label
                  htmlFor='message'
                  className='leading-7 text-sm text-gray-600'>
                  Pesan
                </label>
                <textarea
                  id='message'
                  name='message'
                  required
                  rows='4'
                  className='w-full bg-white rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-base outline-none text-gray-700 py-2 px-3 resize-none transition-colors duration-200 ease-in-out'></textarea>
              </div>
              <button
                type='submit'
                className='text-white bg-purple-600 border-0 py-2 px-6 focus:outline-none hover:bg-purple-700 rounded text-lg transition duration-300'>
                Kirim Pesan
              </button>
              <p className='text-xs text-gray-500 mt-3'>
                Kami akan segera merespons pesan Anda.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
