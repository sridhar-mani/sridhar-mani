import { motion } from 'framer-motion';
import { Mail, MapPin, Briefcase, GraduationCap, Award } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white mb-12 text-center"
        >
          Background & Contact
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 lg:col-span-2"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Education</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start space-x-4">
                  <GraduationCap size={20} className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">B.Tech in Textile Technology</p>
                    <p>Anna University, Chennai</p>
                    <p>CGPA: 7.78 (2019-2023)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <GraduationCap size={20} className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">B.Sc Programming & Data Science</p>
                    <p>IIT Madras</p>
                    <p>CGPA: 7.0 (2021-2024)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <GraduationCap size={20} className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">HSC</p>
                    <p>Bharani Vidhyalaya</p>
                    <p>89.8%</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Experience</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start space-x-4">
                  <Briefcase size={20} className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Associate Software Developer</p>
                    <p>Novacast India Pvt., Coimbatore</p>
                    <p>Jun 2024 - Present</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Briefcase size={20} className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Contract Engineer</p>
                    <p>DEBEL, DRDO, Bangalore</p>
                    <p>Feb 2023 - Oct 2023</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Briefcase size={20} className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Business Development Intern</p>
                    <p>Zech Innovations</p>
                    <p>Jun 2022 - Aug 2022</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Leadership</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start space-x-4">
                  <Award size={20} className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Editorial Head</p>
                    <p>Astro Club</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Award size={20} className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">NSS Volunteer Representative</p>
                    <p>National Service Scheme</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 bg-gray-800 p-6 rounded-lg h-"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Get in Touch</h3>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}