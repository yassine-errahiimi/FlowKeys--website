
export const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", 
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "system", "program", "code", "design", "future", "simple", "minimal", "speed", "test", "focus", "typing", "monkey", "zen", "type", "fast", "slow", "growth",
  "learning", "keyboard", "switch", "linear", "tactile", "clicky", "space", "enter", "escape", "shift", "control", "option", "command", "window", "screen",
  "react", "javascript", "frontend", "engineer", "performance", "aesthetic", "modern", "minimalist", "ui", "ux", "responsive", "dynamic", "static", "logic",
  "component", "state", "effect", "hook", "context", "callback", "memo", "ref", "port", "server", "client", "network", "latency", "throughput", "bandwidth",
  "mountain", "ocean", "forest", "desert", "sky", "cloud", "sun", "moon", "star", "galaxy", "universe", "planet", "gravity", "energy", "matter", "light"
];

export const generateWords = (count: number = 80): string => {
  const result = [];
  const list = [...commonWords];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * list.length);
    result.push(list[randomIndex]);
  }
  return result.join(' ');
};
