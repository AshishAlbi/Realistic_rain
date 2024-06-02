import { defineConfig } from "vite";
import { copy } from 'vite-plugin-copy'


export default defineConfig({
    base:"/Realistic_rain/",
    plugins: [
        copy([{ src: 'static', dest: 'dist' }])
    ]
})