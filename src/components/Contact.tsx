import { motion } from "framer-motion";
import { Mail, MapPin, Briefcase, GraduationCap, Award } from "lucide-react";
import emailjs from "@emailjs/browser";
import { useIsMobile } from "./Projects";

export default function Contact() {
  const isMobile = useIsMobile();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as String;
    const message = formData.get("message") as String;
    const email = formData.get("email") as String;
    console.log(name, message, email, form);

    if (!name || !email || !message) {
      alert("Fill all the required fields.");
      return;
    }
    try {
      await emailjs.sendForm("service_fwaf4ig", "template_nnehlye", form, {
        publicKey: "Q6vXtQ07CKVhozSRP",
      });
      form.reset();
    } catch {
      alert("Seems like the server is busy!Sorry!");
    }
  };
  return (
    <section id="contact" className="min-h-screen bg-gray-900/65 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white mb-12 text-center"
        >
          Background & Contact
        </motion.h2>
        <div className="grid grid-cols-1  lg:grid-cols-3 gap-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 lg:col-span-1"
          >
            <div
              className={`${
                isMobile ? "flex flex-col items-center text-center" : ""
              }`}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Education</h3>
              <div className="space-y-4 md:place-items-start  place-items-center text-gray-300">
                <div className="flex items-start space-x-4">
                  {!isMobile ? (
                    <GraduationCap size={20} className="mt-1 flex-shrink-0" />
                  ) : (
                    <></>
                  )}
                  <div>
                    {isMobile ? (
                      <GraduationCap
                        size={20}
                        className="mt-1 place-self-center flex-shrink-0"
                      />
                    ) : (
                      <></>
                    )}
                    <p className="font-semibold">
                      B.Tech in Textile Technology
                    </p>
                    <p>Anna University, Chennai</p>
                    <p>CGPA: 7.78 (2019-2023)</p>
                  </div>
                </div>
                <div className="flex  items-start space-x-4">
                  {!isMobile ? (
                    <GraduationCap size={20} className="mt-1 flex-shrink-0" />
                  ) : (
                    <></>
                  )}
                  <div>
                    {isMobile ? (
                      <GraduationCap
                        size={20}
                        className="mt-1 place-self-center flex-shrink-0"
                      />
                    ) : (
                      <></>
                    )}
                    <p className="font-semibold">Diploma in Programming</p>
                    <p>IIT Madras</p>
                    <p>CGPA: 7.0 (2021-2024)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  {!isMobile ? (
                    <GraduationCap size={20} className="mt-1 flex-shrink-0" />
                  ) : (
                    <></>
                  )}
                  <div>
                    {isMobile ? (
                      <GraduationCap
                        size={20}
                        className="mt-1 place-self-center flex-shrink-0"
                      />
                    ) : (
                      <></>
                    )}
                    <p className="font-semibold">HSC</p>
                    <p>Bharani Vidhyalaya</p>
                    <p>89.8%</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`${
                isMobile ? "flex flex-col items-center text-center" : ""
              }`}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Leadership</h3>
              <div className="space-y-4 md:place-items-start place-items-center text-gray-300">
                <div className="flex items-start space-x-4">
                  {!isMobile ? (
                    <Award size={20} className="mt-1 flex-shrink-0" />
                  ) : (
                    <></>
                  )}

                  <div>
                    {isMobile ? (
                      <Award
                        size={20}
                        className="mt-1 place-self-center flex-shrink-0"
                      />
                    ) : (
                      <></>
                    )}
                    <p className="font-semibold">Editorial Head</p>
                    <p>Astro Club</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  {!isMobile ? (
                    <Award size={20} className="mt-1 flex-shrink-0" />
                  ) : (
                    <></>
                  )}
                  <div>
                    {isMobile ? (
                      <Award
                        size={20}
                        className="mt-1 place-self-center flex-shrink-0"
                      />
                    ) : (
                      <></>
                    )}
                    <p className="font-semibold">
                      NSS Volunteer Representative
                    </p>
                    <p>National Service Scheme</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 mt-4 lg:col-span-1"
          >
            <div
              className={`${
                isMobile ? "flex flex-col items-center text-center" : ""
              }`}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Experience</h3>
              <div className="space-y-4 md:place-items-start place-items-center text-gray-300">
                <div className="flex items-start space-x-4">
                  {!isMobile ? (
                    <Briefcase size={20} className="mt-1 flex-shrink-0" />
                  ) : (
                    <></>
                  )}
                  <div>
                    {isMobile ? (
                      <Briefcase
                        size={20}
                        className="mt-1 place-self-center flex-shrink-0"
                      />
                    ) : (
                      <></>
                    )}
                    <p className="font-semibold">
                      Associate Software Developer
                    </p>
                    <p>Novacast India Pvt., Coimbatore</p>
                    <p>Jun 2024 - Present</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  {!isMobile ? (
                    <Briefcase size={20} className="mt-1 flex-shrink-0" />
                  ) : (
                    <></>
                  )}
                  <div>
                    {isMobile ? (
                      <Briefcase
                        size={20}
                        className="mt-1 place-self-center flex-shrink-0"
                      />
                    ) : (
                      <></>
                    )}
                    <p className="font-semibold">Contract Engineer</p>
                    <p>DEBEL, DRDO, Bangalore</p>
                    <p>Feb 2023 - Oct 2023</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  {!isMobile ? (
                    <Briefcase size={20} className="mt-1 flex-shrink-0" />
                  ) : (
                    <></>
                  )}
                  <div>
                    {isMobile ? (
                      <Briefcase
                        size={20}
                        className="mt-1 place-self-center flex-shrink-0"
                      />
                    ) : (
                      <></>
                    )}
                    <p className="font-semibold">Business Development Intern</p>
                    <p>Zech Innovations</p>
                    <p>Jun 2022 - Aug 2022</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 mt-4 bg-gray-800 p-6 rounded-lg h-min"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Get in Touch</h3>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 focus:outline-none pt-1 pl-1.5 block w-full rounded-t-md bg-gray-700 border-b-2  border-light-600 text-white shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 focus:outline-none pt-1 pl-1.5 block w-full rounded-t-md bg-gray-700 border-b-2  border-light-600 text-white shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block  text-sm font-medium text-gray-300"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                name="message"
                className="mt-1 pt-1 pl-1.5 block w-full rounded-t-md focus:outline-none bg-gray-700 border-b-2  border-light-600 text-white shadow-sm"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 border:outline-none transition-colors"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
