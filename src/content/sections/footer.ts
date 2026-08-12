export const footer = {
	brand: "Apside",
	tagline:
		"Una agencia de desarrollo con ideas claras, proceso honesto y diseños que se sienten bien.",
	columns: [
		{
			title: "Servicios",
			links: [
				{ label: "Landing Page", href: "#servicios" },
				{ label: "Web completa", href: "#servicios" },
				{ label: "Sistema a medida", href: "#servicios" },
				{ label: "Proceso", href: "#proceso" },
			],
		},
		{
			title: "Apside",
			links: [
				{ label: "Sobre nosotros", href: "#por-que-apside" },
				{ label: "Equipo", href: "#equipo" },
				{ label: "Clientes", href: "#clientes" },
				{ label: "FAQ", href: "#faq" },
			],
		},
		{
			title: "Contacto",
			links: [
				{
					label: "hola@apside.dev",
					href: "mailto:hola@apside.dev",
				},
				{
					label: "Instagram",
					href: "https://www.instagram.com/apside",
					external: true,
				},
				{
					label: "LinkedIn",
					href: "https://www.linkedin.com/company/apside",
					external: true,
				},
			],
		},
	],
} as const;