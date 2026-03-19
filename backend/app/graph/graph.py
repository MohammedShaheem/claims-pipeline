from langgraph.graph import StateGraph
import logging

from .state import ClaimState
from ..agents.segregator import SegregatorNode
from ..agents.id_agent import IDAgentNode
from ..agents.discharge_agent import DischargeAgentNode
from ..agents.bill_agent import BillAgentNode
from ..nodes.aggregator import aggregator_node

logger = logging.getLogger(__name__)

"""Build and compile the claim processing workflow graph."""
def build_graph():
    
    try:
        workflow = StateGraph(ClaimState)
        
        
        workflow.add_node("segregator", SegregatorNode)
        workflow.add_node("id_agent", IDAgentNode)
        workflow.add_node("discharge_agent", DischargeAgentNode)
        workflow.add_node("bill_agent", BillAgentNode)
        workflow.add_node("aggregator", aggregator_node)

       
        workflow.set_entry_point("segregator")

        
        workflow.add_edge("segregator", "id_agent")
        workflow.add_edge("segregator", "discharge_agent")
        workflow.add_edge("segregator", "bill_agent")

        
        workflow.add_edge("id_agent", "aggregator")
        workflow.add_edge("discharge_agent", "aggregator")
        workflow.add_edge("bill_agent", "aggregator")

        
        workflow.set_finish_point("aggregator")

        graph = workflow.compile()
        

        logger.info("LangGraph workflow compiled successfully")

        return graph

    except Exception as e:
        logger.error(f"Failed to build workflow graph: {e}")
        raise