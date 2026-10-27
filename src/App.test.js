import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./api/post', () => ({
  getPost: jest.fn().mockResolvedValue({ data: { data: [] } }),
  storePost: jest.fn(),
}));

test('renders the create post form', async () => {
  render(<App />);

  expect(
    await screen.findByRole('heading', { name: /create post/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('textbox', { name: /post message/i })
  ).toHaveAttribute('placeholder', "What's on your mind?");
  expect(screen.getByRole('button', { name: /^post$/i })).toBeDisabled();
});
