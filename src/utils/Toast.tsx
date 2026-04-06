import Swal from "sweetalert2";

const iconHtml = {
  error: `
    <div style="width:48px;height:48px;border-radius:50%;background:#FAEAE5;
                display:flex;align-items:center;justify-content:center;margin:0 auto;">
      <svg width="22" height="22" fill="none" stroke="#D05A3C" stroke-width="1.8"
           stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <path d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </div>`,

  success: `
    <div style="width:48px;height:48px;border-radius:50%;background:#E6F7F1;
                display:flex;align-items:center;justify-content:center;margin:0 auto;">
      <svg width="22" height="22" fill="none" stroke="#2D8A63" stroke-width="1.8"
           stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7"/>
      </svg>
    </div>`,

  warning: `
    <div style="width:48px;height:48px;border-radius:50%;background:#FEF5E7;
                display:flex;align-items:center;justify-content:center;margin:0 auto;">
      <svg width="22" height="22" fill="none" stroke="#B07D2A" stroke-width="1.8"
           stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      </svg>
    </div>`,

  info: `
    <div style="width:48px;height:48px;border-radius:50%;background:#E8F4FD;
                display:flex;align-items:center;justify-content:center;margin:0 auto;">
      <svg width="22" height="22" fill="none" stroke="#1A73B8" stroke-width="1.8"
           stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </div>`,
};

const swalDefaults: typeof Swal.fire extends (options: infer O) => unknown
  ? O
  : never = {
  background: "#FFFFFF",
  color: "#1A1A1A",
  buttonsStyling: false,
  showClass: { popup: "" },
  hideClass: { popup: "" },
  customClass: {
    popup: [
      "rounded-[14px]",
      "border",
      "border-[#D8D8D8]",
      "shadow-none",
      "px-8",
      "py-7",
      "font-['Inter',_'DM_Sans',_system-ui,_sans-serif]",
    ].join(" "),
    icon: "!border-none !mt-0 !mb-0 !mx-auto",
    title: [
      "!text-[16px]",
      "!font-medium",
      "!text-[#1A1A1A]",
      "!pt-4",
      "!pb-0",
    ].join(" "),
    htmlContainer: "!text-[13px] !text-[#555555] !mt-2 !mb-0 !leading-relaxed",
    actions: "!gap-2 !mt-6 !pt-0",
    confirmButton: [
      "!bg-[#42B883]",
      "hover:!bg-[#2D8A63]",
      "!text-white",
      "!text-[13px]",
      "!font-medium",
      "!py-[9px]",
      "!px-5",
      "!rounded-[9px]",
      "!border-none",
      "!shadow-none",
      "!transition-colors",
      "!duration-150",
    ].join(" "),
    cancelButton: [
      "!bg-[#F4F4F4]",
      "!text-[#555555]",
      "!text-[13px]",
      "!font-medium",
      "!py-[9px]",
      "!px-5",
      "!rounded-[9px]",
      "!border",
      "!border-[#D8D8D8]",
      "!shadow-none",
      "!transition-colors",
      "!duration-150",
    ].join(" "),
    denyButton: [
      "!bg-[#FAEAE5]",
      "!text-[#D05A3C]",
      "!text-[13px]",
      "!font-medium",
      "!py-[9px]",
      "!px-5",
      "!rounded-[9px]",
      "!border",
      "!border-[#F0C0B0]",
      "!shadow-none",
    ].join(" "),
  },
};

export const toast = {
  error: (title: string, text?: string) =>
    Swal.fire({
      ...swalDefaults,
      iconHtml: iconHtml.error,
      title,
      text,
      confirmButtonText: "Got it",
    }),

  success: (title: string, text?: string) =>
    Swal.fire({
      ...swalDefaults,
      iconHtml: iconHtml.success,
      title,
      text,
      confirmButtonText: "Continue",
    }),

  warning: (title: string, text?: string) =>
    Swal.fire({
      ...swalDefaults,
      iconHtml: iconHtml.warning,
      title,
      text,
      confirmButtonText: "OK",
    }),

  info: (title: string, text?: string) =>
    Swal.fire({
      ...swalDefaults,
      iconHtml: iconHtml.info,
      title,
      text,
      confirmButtonText: "OK",
    }),

  confirm: (title: string, text?: string) =>
    Swal.fire({
      ...swalDefaults,
      iconHtml: iconHtml.warning,
      title,
      text,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }),

  danger: (title: string, text?: string) =>
    Swal.fire({
      ...swalDefaults,
      iconHtml: iconHtml.error,
      title,
      text,
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }),
};