import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { prompt, model, action } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Le prompt est requis" },
        { status: 400 }
      );
    }

    // Checking if OpenAI key is present, otherwise we can return a mock or error.
    if (!process.env.OPENAI_API_KEY) {
      // Mock response for demonstration if no API key is provided
      console.warn("No OPENAI_API_KEY found. Returning mock response.");
      return NextResponse.json({
        result: `### Prompt Optimisé pour ${model}\n\n**Contexte :**\nTu agis en tant qu'expert.\n\n**Instructions :**\n${prompt}\n\n**Format de sortie attendu :**\nVeuillez fournir une réponse structurée et détaillée, en utilisant Markdown.\n\n---\n*Note: Ceci est une réponse générée localement. Pour utiliser l'IA en temps réel, veuillez configurer la variable d'environnement OPENAI_API_KEY.*`
      });
    }

    let systemPrompt = `Tu es un expert mondial en "Prompt Engineering".
Ta mission est de prendre l'idée brouillon de l'utilisateur et d'en faire un prompt exceptionnel, structuré, clair, et parfaitement adapté au modèle cible : ${model}.

Voici les règles à suivre strictement :
1. Analyse l'intention cible du brouillon.
2. Structure le prompt final avec des sections claires (ex: # Contexte, # Rôle, # Instructions, # Contraintes, # Format de sortie).
3. Adapte le ton et les directives spécifiquement pour ${model}. Par exemple, Claude 3 préfère le format XML (<tags>), GPT-4 suit bien les listes, DeepSeek est excellent en code/raisonnement pas-à-pas (Chain of Thought).
4. Le résultat final doit être SEULEMENT le prompt prêt à être copié/collé par l'utilisateur dans son LLM. N'ajoute pas de salutations ni d'explications superflues.
`;

    if (action === "concise") {
      systemPrompt += "\n\n⚠️ INSTRUCTION SPÉCIFIQUE : L'utilisateur a demandé de rendre le prompt le plus CONCIS possible. Va droit au but, utilise un vocabulaire direct et minimise les mots inutiles de la structure.";
    } else if (action === "creative") {
      systemPrompt += "\n\n✨ INSTRUCTION SPÉCIFIQUE : L'utilisateur veut un prompt TRÈS CRÉATIF. Utilise des mises en situation immersives, des personnas originaux et demande au LLM d'utiliser des analogies inspirantes.";
    }

    const { text } = await generateText({
      model: openai("gpt-4o"), // The "Agent" orchestrating the prompt creation
      system: systemPrompt,
      prompt: `Voici mon idée brouillon de prompt :\n\n"""\n${prompt}\n"""\n\nOptimise-le pour ${model}.`,
    });

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Erreur API Optimize:", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de l'optimisation." },
      { status: 500 }
    );
  }
}
