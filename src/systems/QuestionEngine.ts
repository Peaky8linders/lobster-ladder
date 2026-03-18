import { Question, HotTake } from '../types';
import { QUESTIONS, HOT_TAKES } from '../data/questions';
import { shuffle } from '../utils/helpers';

class QuestionEngine {
  private unusedQuestions: Question[] = [];
  private unusedHotTakes: HotTake[] = [];

  reset(): void {
    this.unusedQuestions = shuffle([...QUESTIONS]);
    this.unusedHotTakes = shuffle([...HOT_TAKES]);
  }

  getQuestion(minDiff: number, maxDiff: number): Question | null {
    const idx = this.unusedQuestions.findIndex(
      q => q.difficulty >= minDiff && q.difficulty <= maxDiff
    );
    if (idx === -1) {
      // Fallback: any remaining question
      if (this.unusedQuestions.length === 0) return null;
      return this.unusedQuestions.shift()!;
    }
    return this.unusedQuestions.splice(idx, 1)[0];
  }

  getQuestionById(id: string): Question | undefined {
    const idx = this.unusedQuestions.findIndex(q => q.id === id);
    if (idx !== -1) return this.unusedQuestions.splice(idx, 1)[0];
    return QUESTIONS.find(q => q.id === id);
  }

  getHotTake(minDiff: number, maxDiff: number): HotTake | null {
    const idx = this.unusedHotTakes.findIndex(
      ht => ht.difficulty >= minDiff && ht.difficulty <= maxDiff
    );
    if (idx === -1) {
      if (this.unusedHotTakes.length === 0) return null;
      return this.unusedHotTakes.shift()!;
    }
    return this.unusedHotTakes.splice(idx, 1)[0];
  }

  getQuestionsForBoss(questionIds: string[], count: number): Question[] {
    const result: Question[] = [];
    for (const id of questionIds) {
      if (result.length >= count) break;
      const q = this.getQuestionById(id);
      if (q) result.push(q);
    }
    // Fill remaining with difficulty-appropriate questions
    while (result.length < count) {
      const q = this.getQuestion(2, 5);
      if (!q) break;
      result.push(q);
    }
    return result;
  }

  getRemainingCount(): number {
    return this.unusedQuestions.length;
  }
}

export const questionEngine = new QuestionEngine();
