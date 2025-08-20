"""
End-to-end tests for Polish and Optimization features validation.
Tests cover code style, optimization patterns, and integration scenarios.

File: tests/e2e/test_5f8591e6-8de6-4a2c-b99c-07e38513f168_complete.py
"""

# TODO: Fix import - import pytest
from typing import Dict, List, Optional
import json
import os
from datetime import datetime, timedelta

from app.code_analysis.treesitter.pattern_analyzers.style_detector import (
    most_common_style,
    naming_conventions
)
from app.code_analysis.treesitter.enhanced_models import (
    ChangeImpact,
    ProjectStructure,
    AnalysisMode,
    TestCoverage
)
from app.intelligence.analyzers.project_analyzer import (
    dependency_graph,
    impl_files
)
from app.code_analysis.analyzers.language_specific.javascript_analyzer import (
    JavaScriptMetrics
)
from app.api.models.intelligence_models import (
    ProjectStatus,
    ProjectMetricsResponse,
    ProjectExecutionConfig
)
from tests.conftest import test_app, test_client


class TestPolishAndOptimizationFeatures:
    """End-to-end test suite for Polish and Optimization features."""

    @pytest.fixture(autouse=True)
    def setup(self, test_app, test_client):
        """Setup test environment and resources."""
        self.app = test_app
        self.client = test_client
        self.test_project_path = "./test_data/space_invaders_js"
        
        # Ensure test project directory exists
        os.makedirs(self.test_project_path, exist_ok=True)
        
        yield
        
        # Cleanup
        if os.path.exists(self.test_project_path):
            # TODO: Fix import - import shutil
            shutil.rmtree(self.test_project_path)

    def test_code_style_analysis(self):
        """Test code style detection and validation."""
        # Analyze code style patterns
        style_results = most_common_style(self.test_project_path)
        naming_results = naming_conventions(self.test_project_path)

        assert style_results is not None
        assert "indentation" in style_results
        assert "spacing" in style_results
        assert naming_results.get("conventions") is not None

    def test_optimization_metrics(self):
        """Test optimization metrics calculation and validation."""
        js_metrics = JavaScriptMetrics()
        metrics = js_metrics.analyze_project(self.test_project_path)

        assert metrics is not None
        assert "complexity" in metrics
        assert "maintainability" in metrics
        assert metrics["complexity"] >= 0
        assert isinstance(metrics["maintainability"], float)

    def test_project_structure_analysis(self):
        """Test project structure analysis and validation."""
        project_structure = ProjectStructure(
            root_path=self.test_project_path,
            analysis_mode=AnalysisMode.FULL
        )
        structure_analysis = project_structure.analyze()

        assert structure_analysis is not None
        assert "modules" in structure_analysis
        assert "dependencies" in structure_analysis
        assert len(structure_analysis["modules"]) > 0

    def test_dependency_analysis(self):
        """Test project dependency analysis."""
        deps = dependency_graph(self.test_project_path)
        
        assert deps is not None
        assert isinstance(deps, dict)
        assert len(deps) > 0
        
        # Validate circular dependency detection
        circular_deps = self._find_circular_dependencies(deps)
        assert len(circular_deps) == 0, "Circular dependencies detected"

    def test_impact_analysis(self):
        """Test change impact analysis."""
        impact_analyzer = ChangeImpact()
        impact = impact_analyzer.analyze_file_changes([
            f"{self.test_project_path}/src/game.js",
            f"{self.test_project_path}/src/player.js"
        ])

        assert impact is not None
        assert "affected_files" in impact
        assert "risk_level" in impact
        assert isinstance(impact["risk_level"], float)

    def test_test_coverage_analysis(self):
        """Test coverage analysis for project tests."""
        coverage = TestCoverage(self.test_project_path)
        coverage_results = coverage.analyze()

        assert coverage_results is not None
        assert "overall_coverage" in coverage_results
        assert "uncovered_lines" in coverage_results
        assert 0 <= coverage_results["overall_coverage"] <= 100

    def test_project_metrics_integration(self):
        """Test integration of various project metrics."""
        config = ProjectExecutionConfig(
            project_path=self.test_project_path,
            include_tests=True
        )
        
        metrics_response = self._get_project_metrics(config)
        
        assert isinstance(metrics_response, ProjectMetricsResponse)
        assert metrics_response.status == ProjectStatus.COMPLETED
        assert hasattr(metrics_response, "optimization_score")
        assert hasattr(metrics_response, "polish_score")

    def _find_circular_dependencies(self, deps: Dict[str, List[str]]) -> List[List[str]]:
        """Helper method to detect circular dependencies in the dependency graph."""
        visited = set()
        path = []
        circular = []

        def dfs(node: str) -> None:
            if node in path:
                cycle = path[path.index(node):]
                circular.append(cycle)
                return
            
            if node in visited:
                return

            visited.add(node)
            path.append(node)
            
            for neighbor in deps.get(node, []):
                dfs(neighbor)
                
            path.pop()

        for node in deps:
            if node not in visited:
                dfs(node)

        return circular

    def _get_project_metrics(self, config: ProjectExecutionConfig) -> ProjectMetricsResponse:
        """Helper method to get project metrics."""
        try:
            # Analyze implementation files
            files = impl_files(config.project_path)
            
            # Calculate metrics
            js_metrics = JavaScriptMetrics()
            code_metrics = js_metrics.analyze_project(config.project_path)
            
            # Create response
            return ProjectMetricsResponse(
                status=ProjectStatus.COMPLETED,
                optimization_score=code_metrics.get("maintainability", 0),
                polish_score=code_metrics.get("style_score", 0),
                metrics=code_metrics
            )
        except Exception as e:
            return ProjectMetricsResponse(
                status=ProjectStatus.FAILED,
                error=str(e)
            )