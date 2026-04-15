export interface Blog {
  id?: number;
  title_image?: string;
  title_image_url?: string;     
  title: string;
  description: string;
  author: string;
  read_time: string;
  hero_image?: string;
  hero_image_url?: string;      // ← add
  
  intro: string;
  section1_title?: string;
  section1_text?: string;
  image1?: string;
  image1_url?: string;          // ← add
  section2_title?: string;
  section2_text?: string;
  image2?: string;
  image2_url?: string;          // ← add
  section3_title?: string;
  section3_text?: string;
  image3?: string;
  image3_url?: string;          // ← add
  conclusion?: string;
  created_at?: string;
}