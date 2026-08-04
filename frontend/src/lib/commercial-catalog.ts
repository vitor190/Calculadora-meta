export const commercialCatalog = {
  plans: [
    {
      id: 'essential',
      name: 'Essencial',
      value: 147,
      tagline: 'Ideal para começar',
      featured: false,
      features: [
        'Integração com Infarma',
        '1 número de WhatsApp',
        '5 atendentes inclusos',
        'Mensagens e clientes ilimitados',
        'Treinamento online',
      ],
    },
    {
      id: 'professional',
      name: 'Profissional',
      value: 347,
      tagline: 'Mais escolhido',
      featured: true,
      features: [
        'Integração com Infarma',
        '3 números de WhatsApp',
        '15 atendentes inclusos',
        'Mensagens e clientes ilimitados',
        'Treinamento online',
      ],
    },
    {
      id: 'elite',
      name: 'Elite',
      value: 0,
      tagline: 'Solução sob medida',
      featured: false,
      features: [
        'Integração com Infarma',
        'Números de WhatsApp sob medida',
        'Atendentes sob medida',
        'Mensagens e clientes ilimitados',
        'Treinamento prioritário',
      ],
    },
  ],
  resources: [
    { id: 'user', name: 'Usuário adicional', value: 0 },
    { id: 'number', name: 'Número extra', value: 0 },
    { id: 'ecommerce', name: 'E-commerce', value: 0 },
  ],
} as const;
