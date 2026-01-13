import React from 'react'

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[#E1BE4C] text-xs font-bold tracking-[0.3em] uppercase mt-16 mb-6">
    {children}
  </h2>
)

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-serif text-xl text-white mt-8 mb-4">{children}</h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-neutral-400 font-light leading-relaxed mb-4 text-sm">
    {children}
  </p>
)

const List = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc list-inside text-neutral-400 font-light text-sm space-y-2 mb-4 pl-4">
    {children}
  </ul>
)

const Strong = ({ children }: { children: React.ReactNode }) => (
  <strong className="text-white font-normal">{children}</strong>
)

const Section = ({ children }: { children: React.ReactNode }) => (
  <section className="animate-fade-in-up">{children}</section>
)

export const MSAContent = () => (
  <div className="space-y-4">
    <P>
      This Master Services Agreement (“Agreement”) is entered into by and
      between <Strong>Relentnet, LLC</Strong> (“Relentnet”) and the client
      identified in the applicable Statement of Work (“Client”).
    </P>
    <P>
      This Agreement governs all services provided by Relentnet unless expressly
      superseded in writing.
    </P>

    <Section>
      <H2>1. Relationship of the Parties</H2>
      <P>
        Relentnet is an independent contractor. Nothing in this Agreement
        creates a partnership, joint venture, or employment relationship.
      </P>
    </Section>

    <Section>
      <H2>2. Order of Precedence</H2>
      <P>
        In the event of a conflict, the following order of precedence applies:
      </P>
      <ol className="list-decimal list-inside text-neutral-400 font-light text-sm space-y-2 mb-4 pl-4">
        <li>Master Services Agreement (MSA)</li>
        <li>Support & Hosting Agreement (if applicable)</li>
        <li>Statement(s) of Work (SOW)</li>
        <li>Project Agreements</li>
        <li>Accepted quotes</li>
        <li>Accepted invoices</li>
      </ol>
    </Section>

    <Section>
      <H2>3. Intellectual Property</H2>
      <H3>3.1 Ownership (Default)</H3>
      <P>
        Unless expressly stated otherwise in a written agreement, including but
        not limited to a Statement of Work (SOW), Project Agreement, accepted
        quote, or accepted invoice:
      </P>
      <List>
        <li>
          All source code, software, frameworks, libraries, tooling, templates,
          methodologies, processes, and derivative works created or developed by
          Relentnet (“Relentnet Materials”) remain the{' '}
          <Strong>exclusive property of Relentnet</Strong>.
        </li>
        <li>
          No ownership rights are transferred to Client except as expressly
          granted herein.
        </li>
      </List>

      <H3>3.2 Client License (Default)</H3>
      <P>
        Upon full payment, Relentnet grants Client a{' '}
        <Strong>
          perpetual, non-exclusive, non-transferable, royalty-free license
        </Strong>{' '}
        to use the final delivered application or software for Client’s internal
        business purposes.
      </P>
      <P>Client may:</P>
      <List>
        <li>Use the product indefinitely</li>
        <li>Host it on Client-owned or third-party infrastructure</li>
        <li>Modify it for internal use</li>
      </List>
      <P>Client may not:</P>
      <List>
        <li>Resell, sublicense, or distribute the software</li>
        <li>Use Relentnet infrastructure without an active agreement</li>
        <li>Claim ownership of Relentnet Materials</li>
      </List>

      <H3>3.3 Custom Code Ownership by Agreement (Exception)</H3>
      <P>
        Ownership of specific deliverables shall vest in Client{' '}
        <Strong>only if explicitly stated</Strong> in an applicable SOW, Project
        Agreement, accepted quote, or accepted invoice (“Client-Owned Code”).
      </P>
      <P>Any ownership transfer:</P>
      <List>
        <li>
          Applies <Strong>only</Strong> to the expressly identified final
          deliverables
        </li>
        <li>
          Does <Strong>not</Strong> include drafts, prototypes, internal
          artifacts, tooling, reusable components, or background technology
          unless expressly stated
        </li>
      </List>

      <H3>3.4 Relentnet Reuse Rights</H3>
      <P>
        Regardless of ownership, Relentnet retains a{' '}
        <Strong>perpetual, irrevocable, royalty-free right</Strong> to reuse
        generalized concepts, techniques, structures, components, workflows, and
        non-client-specific code developed during the engagement, provided no
        Client confidential information is disclosed.
      </P>

      <H3>3.5 Third-Party Components</H3>
      <P>
        All third-party and open-source software remains subject to its
        respective licenses.
      </P>

      <H3>3.6 Portfolio Rights</H3>
      <P>
        Relentnet may reference Client name and a general description of the
        project in marketing materials unless otherwise agreed in writing.
      </P>
    </Section>

    <Section>
      <H2>4. Confidentiality</H2>
      <P>
        Each party agrees to protect the other’s confidential information and
        use it solely for purposes of this Agreement. Obligations survive five
        (5) years after termination.
      </P>
    </Section>

    <Section>
      <H2>5. Warranties & Disclaimers</H2>
      <P>
        Services are provided <Strong>“as-is” and “as-available.”</Strong>{' '}
        Relentnet disclaims all implied warranties, including merchantability
        and fitness for a particular purpose.
      </P>
    </Section>

    <Section>
      <H2>6. Limitation of Liability</H2>
      <P>
        To the maximum extent permitted by law, Relentnet’s total liability
        shall not exceed the fees paid by Client in the{' '}
        <Strong>
          twelve (12) months preceding the event giving rise to the claim
        </Strong>
        .
      </P>
      <P>
        Relentnet shall not be liable for indirect, incidental, special,
        consequential, or lost-profit damages.
      </P>
      <P>
        <Strong>
          Nothing in this Agreement limits liability for gross negligence,
          willful misconduct, or fraud to the extent prohibited by applicable
          law.
        </Strong>
      </P>
    </Section>

    <Section>
      <H2>7. Indemnification</H2>
      <P>
        Client shall indemnify Relentnet for claims arising from Client content,
        data, instructions, or misuse.
        <br />
        Relentnet shall indemnify Client solely for direct infringement of U.S.
        intellectual property rights by Relentnet-delivered work.
      </P>
    </Section>

    <Section>
      <H2>8. Non-Solicitation</H2>
      <P>
        Client agrees not to solicit or hire Relentnet employees or contractors
        during the engagement and for twelve (12) months thereafter.
      </P>
    </Section>

    <Section>
      <H2>9. Governing Law & Venue</H2>
      <P>
        This Agreement is governed by the laws of the{' '}
        <Strong>State of Tennessee</Strong>, with venue in{' '}
        <Strong>Davidson County, Tennessee</Strong>.
      </P>
    </Section>

    <Section>
      <H2>10. Acceptance</H2>
      <P>
        This Agreement is accepted by signature, portal selection, or payment of
        any invoice issued by Relentnet.
      </P>
      <P>
        Client acknowledges that it has had the opportunity to review this
        Agreement and seek independent legal counsel prior to acceptance.
      </P>
    </Section>
  </div>
)

export const SOWContent = () => (
  <div className="space-y-4">
    <P>
      This Statement of Work (“SOW”) is governed by and incorporated into the
      Master Services Agreement (“MSA”) between Relentnet, LLC and Client.
    </P>

    <Section>
      <H2>1. Scope of Services</H2>
      <P>
        Relentnet shall provide design, development, testing, deployment, and
        limited post-delivery support services as defined in this SOW, an
        accepted quote, or an accepted invoice.
      </P>
    </Section>

    <Section>
      <H2>2. Deliverables & Acceptance</H2>
      <P>Deliverables are defined in the applicable scope documentation.</P>
      <H3>Acceptance Window</H3>
      <P>
        Client shall have <Strong>ten (10) business days</Strong> from delivery
        to provide written notice of material nonconformity.
      </P>
      <P>
        If no notice is provided within this period, the deliverable shall be{' '}
        <Strong>deemed accepted</Strong>.
      </P>
    </Section>

    <Section>
      <H2>3. Limited Post-Delivery Support</H2>
      <P>
        All deliverables include a{' '}
        <Strong>ninety (90) day limited support period</Strong> unless otherwise
        stated. No ongoing support or maintenance is included without a separate
        agreement.
      </P>
    </Section>

    <Section>
      <H2>4. Intellectual Property</H2>
      <P>
        Unless expressly stated otherwise, all deliverables are governed by the
        Intellectual Property provisions of the Master Services Agreement.
      </P>
    </Section>

    <Section>
      <H2>5. Term</H2>
      <P>
        Project duration shall be defined in this SOW, an accepted quote, or an
        accepted invoice.
      </P>
      <P>
        If no duration is defined, the project is deemed{' '}
        <Strong>
          open-ended solely for billing and administrative purposes
        </Strong>{' '}
        and may be terminated in accordance with this Agreement.
      </P>
    </Section>

    <Section>
      <H2>6. Termination</H2>
      <P>Relentnet may terminate this SOW at any time.</P>
      <P>
        Client may terminate with{' '}
        <Strong>thirty (30) days’ written notice</Strong>, subject to payment of
        all incurred fees, committed costs, and applicable minimum terms.
      </P>
      <P>
        Client may not terminate for convenience once development work has
        commenced unless expressly agreed in writing.
      </P>
    </Section>

    <Section>
      <H2>7. Acceptance</H2>
      <P>Payment of any invoice constitutes acceptance of this SOW.</P>
      <P>
        Client acknowledges that it has had the opportunity to review this SOW
        and seek independent legal counsel prior to acceptance.
      </P>
    </Section>
  </div>
)

export const SHAContent = () => (
  <div className="space-y-4">
    <P>
      This Support & Hosting Agreement (“Agreement”) is entered into by and
      between <Strong>Relentnet, LLC</Strong> (“Relentnet”) and Client.
    </P>
    <P>
      This Agreement applies only when Client purchases support services,
      hosting services, or both.
    </P>

    <Section>
      <H2>1. Relationship to Other Agreements</H2>
      <P>
        This Agreement supplements the Master Services Agreement (MSA). In the
        event of conflict:
      </P>
      <ol className="list-decimal list-inside text-neutral-400 font-light text-sm space-y-2 mb-4 pl-4">
        <li>MSA</li>
        <li>This Agreement</li>
        <li>SOW</li>
        <li>Accepted quotes</li>
        <li>Accepted invoices</li>
      </ol>
    </Section>

    <Section>
      <H2>2. Business Hours</H2>
      <P>
        <Strong>Business Hours</Strong> are{' '}
        <Strong>
          9:00 a.m. – 5:00 p.m. Central Standard Time (CST), Monday–Friday
        </Strong>
        , excluding U.S. federal holidays.
      </P>
    </Section>

    <Section>
      <H2>3. Hosting Models</H2>
      <H3>Relentnet-Managed Hosting</H3>
      <P>SLA applies only to Relentnet-managed hosting.</P>
      <H3>Third-Party Hosting</H3>
      <P>
        Relentnet is not responsible for third-party outages, pricing changes,
        or vendor failures. No SLA applies.
      </P>
    </Section>

    <Section>
      <H2>4. Support Requests & Response SLA</H2>
      <P>Support requests must be submitted via designated channels.</P>
      <div className="overflow-x-auto border border-white/10 rounded-sm mb-6">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-white/5 uppercase text-xs tracking-widest text-[#E1BE4C]">
            <tr>
              <th className="p-4 border-b border-white/10">Priority</th>
              <th className="p-4 border-b border-white/10">Description</th>
              <th className="p-4 border-b border-white/10">
                Initial Response Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="p-4">P1</td>
              <td className="p-4">Production down</td>
              <td className="p-4">
                ≤ <Strong>4 business hours</Strong>
              </td>
            </tr>
            <tr>
              <td className="p-4">P2</td>
              <td className="p-4">Major impairment</td>
              <td className="p-4">≤ 1 business day</td>
            </tr>
            <tr>
              <td className="p-4">P3</td>
              <td className="p-4">Minor issues</td>
              <td className="p-4">≤ 2 business days</td>
            </tr>
          </tbody>
        </table>
      </div>
      <P>
        Response time means acknowledgment and triage,{' '}
        <Strong>not resolution</Strong>.
        <br />
        Requests outside Business Hours are deemed received the next business
        day.
      </P>
    </Section>

    <Section>
      <H2>5. Uptime SLA (Relentnet-Managed Only)</H2>
      <div className="overflow-x-auto border border-white/10 rounded-sm mb-6">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-white/5 uppercase text-xs tracking-widest text-[#E1BE4C]">
            <tr>
              <th className="p-4 border-b border-white/10">Plan</th>
              <th className="p-4 border-b border-white/10">Monthly Uptime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="p-4">Standard</td>
              <td className="p-4">99.0%</td>
            </tr>
            <tr>
              <td className="p-4">Professional</td>
              <td className="p-4">99.5%</td>
            </tr>
            <tr>
              <td className="p-4">High Availability</td>
              <td className="p-4">99.9%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <P>
        Excludes maintenance, third-party failures, client actions, and force
        majeure events.
      </P>
    </Section>

    <Section>
      <H2>6. Service Credits (Exclusive Remedy)</H2>
      <P>
        If the SLA is not met, Client may request a{' '}
        <Strong>service credit applied to the next billing cycle</Strong>:
      </P>
      <div className="overflow-x-auto border border-white/10 rounded-sm mb-6">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-white/5 uppercase text-xs tracking-widest text-[#E1BE4C]">
            <tr>
              <th className="p-4 border-b border-white/10">Monthly Uptime</th>
              <th className="p-4 border-b border-white/10">Credit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="p-4">98.0–98.99%</td>
              <td className="p-4">5%</td>
            </tr>
            <tr>
              <td className="p-4">95.0–97.99%</td>
              <td className="p-4">10%</td>
            </tr>
            <tr>
              <td className="p-4">&lt;95%</td>
              <td className="p-4">25%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <P>Credits:</P>
      <List>
        <li>Apply only to future hosting invoices</li>
        <li>
          Must be requested within <Strong>30 days</Strong>
        </li>
        <li>
          Are capped at <Strong>25%</Strong>
        </li>
        <li>
          Have <Strong>no cash value</Strong>
        </li>
        <li>Are the sole and exclusive remedy</li>
      </List>
    </Section>

    <Section>
      <H2>7. No Warranty</H2>
      <P>
        This SLA is a service commitment,{' '}
        <Strong>not a warranty or guarantee</Strong> of uninterrupted service.
      </P>
    </Section>

    <Section>
      <H2>8. Suspension & Termination</H2>
      <P>
        Relentnet may suspend or terminate services for non-payment, security
        risk, abuse, or legal exposure.
      </P>
      <P>Client is responsible for data migration upon termination.</P>
    </Section>

    <Section>
      <H2>9. Governing Law & Venue</H2>
      <P>
        This Agreement is governed by the laws of the{' '}
        <Strong>State of Tennessee</Strong>, venue in{' '}
        <Strong>Davidson County, Tennessee</Strong>.
      </P>
    </Section>

    <Section>
      <H2>10. Acceptance</H2>
      <P>This Agreement is accepted via portal selection or invoice payment.</P>
      <P>
        Client acknowledges that it has had the opportunity to review this
        Agreement and seek independent legal counsel prior to acceptance.
      </P>
    </Section>
  </div>
)
