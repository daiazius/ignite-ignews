import { api } from '../../services/api';
import { useSession, signIn } from 'next-auth/react';
import styles from './styles.module.scss'
import { getStripeJs } from '../../services/stripe-js';

interface SubscribeButtonProps {
  priceId: string;
}

export const SubscribeButton = ({ priceId }: SubscribeButtonProps) => {

  const { data: session } = useSession();

  const handleSubscribe = async () => {
    if(!session) {
      signIn('github')
      return;
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      stripe?.redirectToCheckout({sessionId})

    } catch(e: unknown) {
      if(e instanceof Error) {
        alert(e.message)
      }
    }

  }

  return (
    <button
      type='button'
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}
