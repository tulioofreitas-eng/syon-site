export const prerender = false;

import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

// Syon — id fixo, buscado em `select id from empresas where nome = 'Syon'`
const EMPRESA_ID = "84a08078-fcaf-487a-8dfe-4b30d34bbb77";

const ORIGENS_VALIDAS = ["site", "indicacao", "instagram", "outro", "whatsapp"];

export const POST: APIRoute = async ({ request }) => {
  try {
    let campos: Record<string, string> = {};

    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const corpo = await request.json();
      for (const [chave, valor] of Object.entries(corpo)) {
        campos[chave] = String(valor ?? "");
      }
    } else {
      const dados = await request.formData();
      for (const [chave, valor] of dados.entries()) {
        campos[chave] = String(valor);
      }
    }

    if (campos.site_url) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const nome = (campos.nome ?? "").trim();
    const email = (campos.email ?? "").trim() || null;
    const telefone = (campos.telefone ?? "").trim() || null;
    const interesse = (campos.interesse ?? "").trim() || null;
    const empreendimento = (campos.empreendimento ?? "").trim();
    const mensagemLivre = (campos.mensagem ?? "").trim();

    const origemInformada = (campos.origem ?? "site").trim();
    const origem = ORIGENS_VALIDAS.includes(origemInformada) ? origemInformada : "site";

    if (!nome || (!email && !telefone)) {
      return new Response(
        JSON.stringify({ error: "Nome e um contato (e-mail ou telefone) são obrigatórios." }),
        { status: 400 },
      );
    }

    const mensagem = [empreendimento ? `Empreendimento: ${empreendimento}` : null, mensagemLivre]
      .filter(Boolean)
      .join(" — ") || null;

    const supabase = createClient(
      import.meta.env.SUPABASE_URL!,
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { error } = await supabase.from("leads").insert({
      empresa_id: EMPRESA_ID,
      nome,
      email,
      telefone,
      mensagem,
      servico_interesse: interesse,
      origem,
    });

    if (error) {
      console.error("Erro ao inserir lead:", error);
      return new Response(JSON.stringify({ error: "Não foi possível registrar o contato." }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (erro) {
    console.error("Erro no endpoint /api/lead:", erro);
    return new Response(JSON.stringify({ error: "Erro inesperado." }), { status: 500 });
  }
};
