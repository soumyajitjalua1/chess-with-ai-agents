
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import GameModes from '../components/home/GameModes';
import CallToAction from '../components/home/CallToAction';

const Index = () => {
  return (
    <Layout fullHeight>
      <Hero />
      <GameModes />
      <CallToAction />
    </Layout>
  );
};

export default Index;
