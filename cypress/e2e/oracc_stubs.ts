import { install_stubs } from "cypress/e2e/install_stubs";

export function oracc_stubs(directory_name: string) {
  const stubs = {
    "searches": "http://localhost:8000/search/*",
    "suggests": "http://localhost:8000/suggest_all/*",
    "oracc": "https://build-oracc.museum.upenn.edu/**"
  };
  install_stubs(stubs, directory_name);
}
