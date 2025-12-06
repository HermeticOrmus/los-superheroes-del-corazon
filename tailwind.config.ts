import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': '#e6fffa',
  				'100': '#b2f5ea',
  				'200': '#81e6d9',
  				'300': '#4fd1c5',
  				'400': '#38b2ac',
  				'500': '#00D4B8',
  				'600': '#00a896',
  				'700': '#007f6d',
  				'800': '#005f52',
  				'900': '#004038',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			sunshine: {
  				'50': '#fffef0',
  				'100': '#fffacc',
  				'200': '#fff699',
  				'300': '#fff066',
  				'400': '#ffe933',
  				'500': '#FFD93D',
  				'600': '#e6c300',
  				'700': '#b39800',
  				'800': '#806d00',
  				'900': '#4d4100'
  			},
  			naranja: {
  				'50': '#fff4ed',
  				'100': '#ffe4d1',
  				'200': '#ffc8a3',
  				'300': '#ffa66b',
  				'400': '#ff8c42',
  				'500': '#FF8C42',
  				'600': '#e65100',
  				'700': '#b33d00',
  				'800': '#802c00',
  				'900': '#4d1a00'
  			},
  			rosa: {
  				'50': '#fff5fb',
  				'100': '#ffe5f5',
  				'200': '#ffcceb',
  				'300': '#ffb3d9',
  				'400': '#ff99cc',
  				'500': '#FFB3D9',
  				'600': '#e680b3',
  				'700': '#b3508d',
  				'800': '#803367',
  				'900': '#4d1f3d'
  			},
  			purpura: {
  				'50': '#faf5ff',
  				'100': '#f3e8ff',
  				'200': '#e9d5ff',
  				'300': '#d8b4fe',
  				'400': '#c084fc',
  				'500': '#B366FF',
  				'600': '#9333ea',
  				'700': '#7c1fb8',
  				'800': '#5e1686',
  				'900': '#3f0e5a'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			display: [
  				'Caveat',
  				'cursive'
  			],
  			handwritten: [
  				'Caveat',
  				'cursive'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
