import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://hgcfcszhbppvshmjzsun.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY2Zjc3poYnBwdnNobWp6c3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTYyOTMsImV4cCI6MjA5MDczMjI5M30.hZrNK2zkxKl62Bf2-Yc-15CvKjV1kVG8LAzRjHfQSMQ"
  }
};

export default nextConfig;
