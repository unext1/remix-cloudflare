import { Body, Button, Container, Head, Html, Section, Text } from '@react-email/components';

export function EmailTemplate() {
  return (
    <Html className="bg-gray-50 h-screen flex justify-center items-center">
      <Head />
      <Body className="bg-white shadow-xl p-8 rounded-xl max-w-md">
        <Container className="container my-8 mx-auto text-center text-black">
          <Section className="">
            <Text className="text-red-400">
              <strong>Lauva.Dev</strong>
            </Text>
          </Section>

          <Section>
            <Button className="mt-4">
              <strong>View On Site</strong>
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default EmailTemplate;
