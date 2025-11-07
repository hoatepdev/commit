import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast, toast } from '../use-toast';

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with empty toasts array', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('adds a toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'Test description',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');
    expect(result.current.toasts[0].description).toBe('Test description');
  });

  it('generates unique IDs for toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Toast 1' });
      result.current.toast({ title: 'Toast 2' });
    });

    expect(result.current.toasts[0].id).not.toBe(result.current.toasts[1].id);
  });

  it('dismisses a specific toast', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;
    act(() => {
      const { id } = result.current.toast({ title: 'Test' });
      toastId = id;
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(toastId);
    });

    // Toast is marked as not open
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('limits number of toasts to TOAST_LIMIT', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Toast 1' });
      result.current.toast({ title: 'Toast 2' });
    });

    // Should only keep the most recent toast (limit is 1)
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Toast 2');
  });

  it('supports standalone toast function', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({
        title: 'Standalone Toast',
        description: 'Called from anywhere',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Standalone Toast');
  });

  it('supports variant property', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Error Toast',
        variant: 'destructive',
      });
    });

    expect(result.current.toasts[0].variant).toBe('destructive');
  });

  it('supports action element', () => {
    const { result } = renderHook(() => useToast());

    const action = { altText: 'Undo' } as any;

    act(() => {
      result.current.toast({
        title: 'Toast with action',
        action,
      });
    });

    expect(result.current.toasts[0].action).toBe(action);
  });
});
