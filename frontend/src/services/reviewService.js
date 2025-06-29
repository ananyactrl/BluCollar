export async function getReviewSummary(userId, token) {
  const res = await fetch(`/api/reviews/${userId}/summary`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch review summary');
  return await res.json();
}

export async function getReviews(userId, token) {
  const res = await fetch(`/api/reviews/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return await res.json();
} 