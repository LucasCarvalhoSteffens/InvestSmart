from django.core.management.base import BaseCommand

from apps.portfolios.services.alerts import PortfolioAlertService


class Command(BaseCommand):
    help = "Verifica preço atual vs. preço teto e gera alertas automáticos."

    def add_arguments(self, parser):
        parser.add_argument(
            "--no-refresh",
            action="store_true",
            help="Não atualiza cotações via Yahoo Finance antes de verificar os alertas.",
        )
        parser.add_argument(
            "--cooldown-hours",
            type=int,
            default=24,
            help="Intervalo mínimo, em horas, para evitar alerta duplicado.",
        )
        parser.add_argument(
            "--portfolio-id",
            type=int,
            default=None,
            help="Executa a verificação apenas para uma carteira específica.",
        )

    def handle(self, *args, **options):
        service = PortfolioAlertService(
            force_refresh=not options["no_refresh"],
            cooldown_hours=options["cooldown_hours"],
            portfolio_id=options["portfolio_id"],
        )

        summary = service.run()

        self.stdout.write(
            self.style.SUCCESS(
                "Verificação concluída: "
                f"{summary.checked_items} itens verificados, "
                f"{summary.created_events} alertas gerados, "
                f"{summary.skipped_items} itens sem preço teto, "
                f"{summary.failed_updates} falhas ao atualizar cotações."
            )
        )