import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { env } from "process";
import { readFileSync } from "fs";
import * as path from "path";
import * as fs from "fs";
import * as childProcess from "child_process";

const getCertifatePaths = () => {
  const baseFolder =
    process.env.APPDATA !== undefined && process.env.APPDATA !== ""
      ? `${process.env.APPDATA}/ASP.NET/https`
      : `${process.env.HOME}/.aspnet/https`;

  const certificateName = process.env.npm_package_name;

  const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
  const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

  return { certFilePath, keyFilePath };
};

const createCertificates = (certFilePath: string) => {
  console.log(`creating certificate at ${certFilePath}`);

  childProcess.spawnSync(
    "dotnet",
    [
      "dev-certs",
      "https",
      "--export-path",
      certFilePath,
      "--format",
      "Pem",
      "--no-password",
    ],
    { stdio: "inherit" }
  );
};

const getProxyUrl = () => {
  const httpsPort = env.ASPNETCORE_HTTPS_PORT;
  if (httpsPort) return `https://localhost:${httpsPort}`;

  const aspUrls = env.ASPNETCORE_URLS;
  if (aspUrls) return env.ASPNETCORE_URLS.split(";")[0];

  return "https://localhost:5001";
};

export default defineConfig(() => {
  const { certFilePath, keyFilePath } = getCertifatePaths();
  if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    createCertificates(certFilePath);
  }

  const proxySettings = { target: getProxyUrl(), secure: false };

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      https: {
        key: readFileSync(keyFilePath),
        cert: readFileSync(certFilePath),
      },
      port: 3000,
      strictPort: true,
      proxy: {
        "/greet.v1.GreeterService": proxySettings,
      },
    },
  };
});
