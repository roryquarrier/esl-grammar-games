import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionModal } from './QuestionModal';
import type { Question } from './QuestionModal';

describe('QuestionModal', () => {
  const mockQuestion: Question = {
    id: 'q1',
    question: 'What is the past tense of "go"?',
    options: ['goed', 'went', 'going', 'gone'],
    correctIndex: 1,
    topic: 'past-tense',
    level: 'easy',
  };

  it('displays question text', () => {
    const onAnswer = vi.fn();
    render(
      <QuestionModal
        question={mockQuestion}
        onAnswer={onAnswer}
        playerId="Player 1"
      />
    );

    expect(screen.getByText(mockQuestion.question)).toBeInTheDocument();
  });

  it('displays all options with letters', () => {
    const onAnswer = vi.fn();
    render(
      <QuestionModal
        question={mockQuestion}
        onAnswer={onAnswer}
        playerId="Player 1"
      />
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('goed')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('went')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('going')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('gone')).toBeInTheDocument();
  });

  it('displays player ID and topic', () => {
    const onAnswer = vi.fn();
    render(
      <QuestionModal
        question={mockQuestion}
        onAnswer={onAnswer}
        playerId="Player 1"
      />
    );

    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('past-tense')).toBeInTheDocument();
    expect(screen.getByText('easy')).toBeInTheDocument();
  });

  it('calls onAnswer(true) when correct option is clicked', () => {
    const onAnswer = vi.fn();
    render(
      <QuestionModal
        question={mockQuestion}
        onAnswer={onAnswer}
        playerId="Player 1"
      />
    );

    const wentButton = screen.getByText('went').closest('button');
    fireEvent.click(wentButton!);

    expect(onAnswer).toHaveBeenCalledWith(true);
  });

  it('calls onAnswer(false) when wrong option is clicked', () => {
    const onAnswer = vi.fn();
    render(
      <QuestionModal
        question={mockQuestion}
        onAnswer={onAnswer}
        playerId="Player 1"
      />
    );

    const goedButton = screen.getByText('goed').closest('button');
    fireEvent.click(goedButton!);

    expect(onAnswer).toHaveBeenCalledWith(false);
  });

  it('has proper ARIA attributes for accessibility', () => {
    const onAnswer = vi.fn();
    render(
      <QuestionModal
        question={mockQuestion}
        onAnswer={onAnswer}
        playerId="Player 1"
      />
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-label', 'Grammar question');
  });

  it('options have accessible labels', () => {
    const onAnswer = vi.fn();
    render(
      <QuestionModal
        question={mockQuestion}
        onAnswer={onAnswer}
        playerId="Player 1"
      />
    );

    expect(screen.getByLabelText('Option 1: goed')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2: went')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 3: going')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 4: gone')).toBeInTheDocument();
  });

  it('displays difficulty level badge', () => {
    const onAnswer = vi.fn();
    const hardQuestion = { ...mockQuestion, level: 'hard' as const };
    render(
      <QuestionModal
        question={hardQuestion}
        onAnswer={onAnswer}
        playerId="Player 1"
      />
    );

    expect(screen.getByText('hard')).toBeInTheDocument();
  });
});
