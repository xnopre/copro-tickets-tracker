# Accessibility (WCAG 2.1 Level AA)

All visual components MUST meet WCAG 2.1 AA standards.

## 1. Semantic HTML Elements

```tsx
// ✅ GOOD
<article>
  <header><h1>Title</h1></header>
  <nav aria-label="Back navigation"><a href="/">Back</a></nav>
  <section aria-labelledby="desc">
    <h2 id="desc">Description</h2>
    <p>Content...</p>
  </section>
  <footer aria-label="Additional info">
    <time dateTime="2025-01-15T10:30:00">Jan 15, 2025 at 10:30</time>
  </footer>
</article>

// ❌ BAD — Generic divs
<div><div><div>Title</div>...</div></div>
```

## 2. ARIA Attributes

### Lists & States

```tsx
<div role="list" aria-label="5 tickets">
  {tickets.map(ticket => <TicketCard key={ticket.id} />)}
</div>

<div role="status" aria-live="polite">
  <p>No tickets to display</p>
</div>
```

### Forms

```tsx
<label htmlFor="title">
  Title <span aria-label="required">*</span>
</label>
<input
  id="title"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'error-id' : undefined}
/>
{error && <div id="error-id" role="alert" aria-live="assertive">{error}</div>}

<button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
  {isSubmitting ? 'Creating...' : 'Create'}
</button>
```

## 3. Focus & Keyboard Navigation

```tsx
// ✅ Visible focus with Tailwind
<Link href="/" className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
  Back
</Link>

// ❌ Avoid positive tabindex
<div role="button" tabIndex={1}>...</div>  // BAD
<div role="button" tabIndex={0}>...</div>  // GOOD
```

## 4. Dates & Times

Always use `<time>` with `dateTime` attribute:

```tsx
<time dateTime={ticket.createdAt.toISOString()}>{formatTicketDate(ticket.createdAt)}</time>
```

## 5. Accessibility Tests

```typescript
describe('Accessibility', () => {
  it('should have proper semantic and ARIA attributes', () => {
    const { container } = render(<MyComponent />);

    expect(screen.getByRole('link')).toHaveAttribute('aria-label', 'Description');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(container.querySelector('article')).toBeInTheDocument();
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });
});
```

## Pre-delivery Checklist

- [ ] Semantic HTML: `article`, `nav`, `header`, `footer`, `section`, `main`
- [ ] Interactive elements have descriptive `aria-label`
- [ ] Form labels: `htmlFor` linked to `id`
- [ ] Required fields: `aria-required="true"`
- [ ] Errors: `role="alert"` + `aria-live="assertive"`
- [ ] Success: `role="status"` + `aria-live="polite"`
- [ ] Loading state: `aria-busy="true"`
- [ ] Dates use `<time dateTime="..."`
- [ ] Focus visible (Tailwind ring)
- [ ] Accessibility tests pass

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
