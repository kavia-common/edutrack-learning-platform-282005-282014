import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { 
    languageOptions: { 
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      },
      globals: {
        document: true,
        window: true,
        test: true,
        expect: true
      }
    },
    rules: {
      // Do not fail builds on unused vars in preview/demo mode
      "no-unused-vars": ["warn", { varsIgnorePattern: "React|App|getEnv|useEffect|useMemo|useCallback|toFileName|idx|codeOfConduct|nda|offerLetter" }],
      // Accessibility: relax anchor-is-valid for admin preview links rendered as buttons
      "jsx-a11y/anchor-is-valid": "warn",
      // React hooks exhaustive deps can be noisy in demo data tables
      "react-hooks/exhaustive-deps": "warn"
    }
  },
  pluginJs.configs.recommended,
  {
    plugins: { react: pluginReact },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error"
    }
  }
]
