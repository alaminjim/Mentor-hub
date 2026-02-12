"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { tutorService } from "@/components/service/tutor.service";
import { Loader2, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  subjects: z.string().min(1, "At least one subject is required"),
  experience: z.number().min(0, "Experience must be 0 or greater"),
  hourlyRate: z.string().min(1, "Hourly rate is required"),
});

type AvailabilitySlot = {
  day: string;
  timeSlot: string;
};

export default function CreateTutorProfileForm() {
  const router = useRouter();
  const [availabilitySlots, setAvailabilitySlots] = useState<
    AvailabilitySlot[]
  >([{ day: "", timeSlot: "" }]);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bio: "",
      subjects: "",
      experience: 0,
      hourlyRate: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating profile...");
      try {
        const validSlots = availabilitySlots.filter(
          (slot) => slot.day && slot.timeSlot,
        );
        if (validSlots.length === 0) {
          toast.error("Please add at least one availability slot", {
            id: toastId,
          });
          return;
        }

        const subjectsArray = value.subjects
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        const availability: Record<string, string[]> = {};
        validSlots.forEach((slot) => {
          const dayKey = slot.day.toLowerCase();
          if (!availability[dayKey]) {
            availability[dayKey] = [];
          }
          availability[dayKey].push(slot.timeSlot);
        });

        const rate = parseFloat(value.hourlyRate);
        if (isNaN(rate) || rate <= 0) {
          toast.error("Please enter a valid hourly rate", {
            id: toastId,
          });
          return;
        }

        const profilePayload = {
          name: value.name,
          email: value.email,
          phone: value.phone,
          bio: value.bio,
          subjects: subjectsArray,
          price: rate,
          experience: value.experience,
          hourlyRate: rate,
          availability: availability,
        };

        const response = await tutorService.createTutorProfile(profilePayload);

        if (response.success) {
          toast.success("Tutor profile created successfully!", {
            id: toastId,
          });
          router.push("/dashboard/tutor");
          router.refresh();
        } else {
          toast.error(response.error || "Failed to create profile", {
            id: toastId,
          });
        }
      } catch (error: any) {
        console.error("Error creating profile:", error);
        toast.error(error.message || "An error occurred. Please try again.", {
          id: toastId,
        });
      }
    },
  });

  const addAvailabilitySlot = () => {
    setAvailabilitySlots([...availabilitySlots, { day: "", timeSlot: "" }]);
  };

  const removeAvailabilitySlot = (index: number) => {
    if (availabilitySlots.length > 1) {
      setAvailabilitySlots(availabilitySlots.filter((_, i) => i !== index));
    }
  };

  const updateAvailabilitySlot = (
    index: number,
    field: "day" | "timeSlot",
    value: string,
  ) => {
    const updated = [...availabilitySlots];
    updated[index][field] = value;
    setAvailabilitySlots(updated);
  };

  const daysOfWeek = [
    { value: "sat", label: "Saturday" },
    { value: "sun", label: "Sunday" },
    { value: "mon", label: "Monday" },
    { value: "tue", label: "Tuesday" },
    { value: "wed", label: "Wednesday" },
    { value: "thu", label: "Thursday" },
    { value: "fri", label: "Friday" },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your <span className="text-sky-500">Tutor Profile</span>
          </h2>
          <p className="text-gray-600">
            Set up your profile to start connecting with students
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* Name */}
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Name <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your full name"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Email <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="your.email@example.com"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="phone"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Phone Number <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="tel"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="01712345678"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>

            {/* Bio */}
            <form.Field
              name="bio"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Bio <span className="text-red-500">*</span>
                    </FieldLabel>
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={4}
                      placeholder="Tell students about yourself..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Subjects */}
            <form.Field
              name="subjects"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Subjects (comma separated){" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g., Bangla, Grammar, Writing"
                    />
                    <FieldDescription>
                      Separate subjects with commas
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Experience & Hourly Rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form.Field
                name="experience"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Experience (years){" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(parseInt(e.target.value) || 0)
                        }
                        min="0"
                        placeholder="3"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="hourlyRate"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Hourly Rate (৳) <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="900"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>

            {/* Availability */}
            <div>
              <FieldLabel>
                Availability <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldDescription className="mb-3">
                Add your available days and time slots
              </FieldDescription>

              <div className="space-y-3">
                {availabilitySlots.map((slot, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <select
                        value={slot.day}
                        onChange={(e) =>
                          updateAvailabilitySlot(index, "day", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      >
                        <option value="">Select day</option>
                        {daysOfWeek.map((day) => (
                          <option key={day.value} value={day.value}>
                            {day.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1">
                      <Input
                        type="text"
                        value={slot.timeSlot}
                        onChange={(e) =>
                          updateAvailabilitySlot(
                            index,
                            "timeSlot",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., 9am-12pm"
                        className="w-full"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeAvailabilitySlot(index)}
                      disabled={availabilitySlots.length === 1}
                      className="shrink-0"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addAvailabilitySlot}
                className="mt-3 w-full"
              >
                <Plus className="size-4 mr-2" />
                Add More Availability
              </Button>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <form.Subscribe
                selector={(state) => ({
                  isSubmitting: state.isSubmitting,
                })}
              >
                {({ isSubmitting }) => (
                  <>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-5 animate-spin mr-2" />
                          Creating Profile...
                        </>
                      ) : (
                        "Create Profile"
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => router.back()}
                      disabled={isSubmitting}
                      variant="outline"
                      className="px-6"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </form.Subscribe>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
