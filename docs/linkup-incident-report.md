# Incident Report — LinkUp Data Breach

**Prepared by:** Connector Security Team
**Date:** February 28, 2026

---

## What Happened

LinkUp, a competing teen social platform, disclosed a data breach last week affecting approximately 340,000 user accounts. The breach was traced to a vulnerability in their authentication flow — specifically, session tokens that did not expire after logout.

An attacker captured tokens from a public Wi-Fi network and used them to access accounts for weeks after the original users had logged out.

---

## What Data Was Exposed

- Usernames
- Email addresses
- Direct messages
- School and location information (in some cases)

---

## Public Reaction

- **#LinkUpBreach** trended on Twitter for two days
- Three schools in New York City sent letters to parents warning them about the platform
- LinkUp's app store rating dropped from **4.2 to 1.8 stars** within 48 hours

---

## Why This Matters for Us

The vulnerability that caused the LinkUp breach — non-expiring session tokens — also appears on our CVE list. See **CVE-01 (CVE-2022-23540)**.

We have not yet fixed it. We have no public statement prepared.

---

## Guiding Questions for the Team

1. Does the LinkUp breach change which CVEs you prioritize? Why or why not?
2. If a journalist asks "Is Connector affected by the same vulnerability as LinkUp?" — what do you say?
3. What would need to be true for you to move a lower-severity CVE above a higher-severity one?
4. If you could only fix two vulnerabilities this week, which two would you pick — and what does that choice say about your priorities as a team?
