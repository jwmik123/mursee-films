"use client";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { gsap } from "gsap";

const ContactDialog = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const dialogRef = useRef(null);
  const backdropRef = useRef(null);
  const contentRef = useRef(null);

  const projectTypes = [
    "Commercial",
    "Social video",
    "Bedrijfsfilm",
    "Muziekvideo",
    "Event",
    "Anders",
  ];

  const budgetRanges = [
    "Minder dan €3.000",
    "€3.000 - €8.000",
    "Meer dan €8.000",
  ];

  useEffect(() => {
    if (isOpen) {
      // Set initial state and animate in
      gsap.set(dialogRef.current, { x: "100%" });
      gsap.set(backdropRef.current, { opacity: 0 });

      const tl = gsap.timeline();
      tl.to(backdropRef.current, { opacity: 1, duration: 0.3 }).to(
        dialogRef.current,
        { x: "0%", duration: 0.4, ease: "power2.out" },
        "-=0.1"
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    const tl = gsap.timeline();
    tl.to(dialogRef.current, { x: "100%", duration: 0.3, ease: "power2.in" })
      .to(backdropRef.current, { opacity: 0, duration: 0.2 }, "-=0.1")
      .call(() => onClose());
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          projectType: "",
          budget: "",
          message: "",
        });
        setTimeout(() => {
          handleClose();
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="absolute top-0 right-0 h-full w-full md:w-1/3 bg-white shadow-xl"
      >
        {/* Content Container */}
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-franklin font-bold text-black">
              Start een project
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Container - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-franklin text-gray-700 mb-2"
                  >
                    Naam *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-franklin"
                    placeholder="Jouw naam"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-franklin text-gray-700 mb-2"
                  >
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-franklin"
                    placeholder="jouw@email.com"
                  />
                </div>

                {/* Project Type */}
                <div>
                  <label
                    htmlFor="projectType"
                    className="block text-sm font-franklin text-gray-700 mb-2"
                  >
                    Type project *
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    required
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-franklin bg-white"
                  >
                    <option value="">Selecteer een type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label
                    htmlFor="budget"
                    className="block text-sm font-franklin text-gray-700 mb-2"
                  >
                    Budget *
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    required
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-franklin bg-white"
                  >
                    <option value="">Selecteer budget</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-franklin text-gray-700 mb-2"
                  >
                    Bericht
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-franklin resize-none"
                    placeholder="Vertel ons kort over jouw project…"
                  />
                </div>
              </div>

              {/* Submit Status */}
              {submitStatus && (
                <div
                  className={`mt-6 p-4 rounded-md font-franklin text-sm ${
                    submitStatus === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {submitStatus === "success"
                    ? "Bedankt! We nemen zo snel mogelijk contact met je op."
                    : "Er is iets misgegaan. Probeer het opnieuw."}
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-3 px-6 font-franklin text-sm uppercase hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  {isSubmitting ? "Versturen..." : "Verstuur bericht"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDialog;
