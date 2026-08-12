export const contact = {
	eyebrow: "Contacto",
	title: "¿Hablamos?",
	description:
		"Contanos tu idea y te respondemos en menos de 24 horas. Sin compromiso, sin vueltas.",
	channels: [
		{
			label: "Email",
			value: "hola@apside.dev",
			href: "mailto:hola@apside.dev",
			icon: "mail",
		},
		{
			label: "WhatsApp",
			value: "+54 9 11 0000-0000",
			href: "https://wa.me/5491100000000",
			icon: "whatsapp",
		},
		{
			label: "Instagram",
			value: "@apside",
			href: "https://www.instagram.com/apside",
			icon: "instagram",
		},
		{
			label: "LinkedIn",
			value: "Apside",
			href: "https://www.linkedin.com/company/apside",
			icon: "linkedin",
		},
	],
	serviceOptions: ["Landing Page", "Web completa", "Sistema a medida", "Otro"],
} as const;