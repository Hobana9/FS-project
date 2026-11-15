import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export type LoadStatus = 'loading' | 'error' | 'ready';

type DemoScenario = 'normal' | 'error' | 'empty';

type ListState = {
  scenario: DemoScenario;
  status: LoadStatus;
};

/** Временная имитация загрузки списков до подключения API. */
export function useDemoList<T>(items: readonly T[]) {
  const [searchParams] = useSearchParams();
  const mode = import.meta.env.DEV ? searchParams.get('demo') : null;
  const scenario: DemoScenario =
    mode === 'error' || mode === 'empty' ? mode : 'normal';

  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<ListState>({
    scenario,
    status: 'loading',
  });
  const failNextRequest = useRef(false);

  useEffect(() => {
    failNextRequest.current = scenario === 'error';
  }, [scenario]);

  useEffect(() => {
    setState({ scenario, status: 'loading' });

    const timer = window.setTimeout(() => {
      if (failNextRequest.current) {
        failNextRequest.current = false;
        setState({ scenario, status: 'error' });
      } else {
        setState({ scenario, status: 'ready' });
      }
    }, 600);

    return () => window.clearTimeout(timer);
  }, [scenario, attempt]);

  function retry() {
    setState({ scenario, status: 'loading' });
    setAttempt((currentAttempt) => currentAttempt + 1);
  }

  return {
    data: scenario === 'empty' ? [] : items,
    status: state.scenario === scenario ? state.status : 'loading',
    retry,
  };
}